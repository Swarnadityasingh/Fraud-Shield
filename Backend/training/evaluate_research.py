"""Produce held-out research evidence without overwriting the serving models."""
import argparse
from pathlib import Path
from tempfile import TemporaryDirectory

import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import pyarrow.parquet as pq
from sklearn.base import clone
from sklearn.dummy import DummyClassifier
from sklearn.metrics import (accuracy_score, average_precision_score, auc, confusion_matrix,
    ConfusionMatrixDisplay, precision_recall_curve, precision_score, recall_score,
    f1_score, roc_auc_score, RocCurveDisplay, PrecisionRecallDisplay)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

ROOT = Path(__file__).resolve().parents[1]
SPLITS = ("train", "validation", "holdout")


def fraud_arrays(preprocessor, folder, temp):
    arrays = []
    seen = set()
    last_time = -np.inf
    for split in SPLITS:
        file = pq.ParquetFile(folder / f"{split}.parquet")
        columns = list(preprocessor.feature_names_in_)
        matrix = np.memmap(Path(temp) / split, mode="w+", dtype="float32",
                           shape=(file.metadata.num_rows, len(preprocessor.get_feature_names_out())))
        labels = []
        offset = 0
        for batch in file.iter_batches(batch_size=4096, columns=columns + ["isFraud", "TransactionID"]):
            df = batch.to_pandas()
            ids = df.TransactionID
            if ids.duplicated().any() or seen.intersection(ids) or df.TransactionDT.min() < last_time:
                raise ValueError("Overlapping IDs or invalid temporal order")
            if not df.TransactionDT.is_monotonic_increasing:
                raise ValueError("Unsorted transactions")
            seen.update(ids)
            last_time = df.TransactionDT.max()
            matrix[offset:offset + len(df)] = preprocessor.transform(df[columns])
            labels.extend(df.isFraud)
            offset += len(df)
        arrays.append((matrix, np.asarray(labels)))
    return arrays


def credit_arrays(preprocessor, path):
    data = pd.read_csv(path)
    target = "SeriousDlqin2yrs"
    train, held = train_test_split(data, test_size=.30, random_state=42, stratify=data[target])
    val, test = train_test_split(held, test_size=.5, random_state=42, stratify=held[target])
    columns = list(train.drop(columns=[target, "Unnamed: 0"]))
    preprocessor.fit(train[columns])
    return [(preprocessor.transform(part[columns]), part[target].to_numpy()) for part in (train, val, test)]


def save_plot(out, name):
    plt.tight_layout()
    plt.savefig(out / f"{name}.png", dpi=160, bbox_inches="tight")
    plt.close()


def evaluate(args, temp):
    fraud = args.model == "fraud"
    filename = "ieee_cis_model" if fraud else "credit_risk_model"
    pipeline = joblib.load(ROOT / "app/models" / f"{filename}.joblib")
    prep = pipeline.named_steps["preprocessor"]
    base = pipeline.named_steps["classifier"]
    if fraud:
        arrays = fraud_arrays(prep, args.fraud_splits, temp)
    else:
        prep = clone(prep)
        arrays = credit_arrays(prep, args.credit_csv)
    out = args.output / args.model
    out.mkdir(parents=True, exist_ok=True)
    (x, y), (xv, yv), (xt, yt) = arrays
    stats = [dict(split=s, rows=len(t), positive=int(t.sum()), negative=int(len(t)-t.sum()),
                  prevalence=t.mean()) for s, (_, t) in zip(SPLITS, arrays)]
    pd.DataFrame(stats).to_csv(out / "distribution.csv", index=False)
    trials, candidates = [], {}
    for name, weight in [("weighted", "balanced_subsample"), ("unweighted", None), ("prior", None)]:
        print(args.model, name, flush=True)
        if name == "prior":
            model = DummyClassifier(strategy="prior").fit(x, y)
        elif fraud and name == "weighted":
            model = base  # shipped fit on the same chronological training partition
        else:
            model = clone(base).set_params(class_weight=weight, n_jobs=4).fit(x, y)
        val_scores = model.predict_proba(xv)[:, 1]
        for threshold in np.arange(1, 100) / 100:
            pred = val_scores >= threshold
            trials.append(dict(model=name, threshold=threshold, precision=precision_score(yv, pred, zero_division=0),
                               recall=recall_score(yv, pred), f1=f1_score(yv, pred)))
        best = max((r for r in trials if r["model"] == name), key=lambda r: (r["f1"], r["precision"], r["threshold"]))
        candidates[name] = (model, best)
    selected = max(("weighted", "unweighted"), key=lambda n: candidates[n][1]["f1"])
    if args.export:
        classifier, operating_point = candidates[selected]
        serving = Pipeline([("preprocessor", prep), ("classifier", classifier)])
        serving.decision_threshold_ = float(operating_point["threshold"])
        args.export.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(serving, args.export, compress=3)
    pd.DataFrame(trials).to_csv(out / "validation_thresholds.csv", index=False)
    results = []
    for name, (model, best) in candidates.items():
        scores = model.predict_proba(xt)[:, 1]
        pred = scores >= best["threshold"]
        cm = confusion_matrix(yt, pred, labels=[0, 1])
        tn, fp, fn, tp = cm.ravel()
        precision, recall, _ = precision_recall_curve(yt, scores)
        results.append(dict(model=name, selected=name == selected, threshold=best["threshold"],
            accuracy=accuracy_score(yt,pred), precision=precision_score(yt,pred,zero_division=0),
            recall=recall_score(yt,pred), f1=f1_score(yt,pred), roc_auc=roc_auc_score(yt,scores),
            pr_auc=auc(recall,precision), average_precision=average_precision_score(yt,scores),
            tn=tn, fp=fp, fn=fn, tp=tp))
        if name == selected:
            title = "Transaction fraud" if fraud else "Serious delinquency"
            ConfusionMatrixDisplay(cm, display_labels=["Negative", "Positive"]).plot(values_format="d")
            plt.title(title + " | final test")
            save_plot(out, "confusion_matrix")
            RocCurveDisplay.from_predictions(yt, scores, name=title)
            save_plot(out, "roc")
            PrecisionRecallDisplay.from_predictions(yt, scores, name=title)
            save_plot(out, "precision_recall")
            imp = pd.Series(model.feature_importances_, index=prep.get_feature_names_out()).sort_values(ascending=False)
            imp.to_csv(out / "importance.csv", header=["impurity_importance"], index_label="feature")
            imp.head(12).sort_values().rename(index=lambda s:s.split("__",1)[-1]).plot.barh()
            plt.xlabel("Mean decrease in impurity")
            plt.title(title)
            save_plot(out, "feature_importance")
    pd.DataFrame(results).to_csv(out / "test_metrics.csv", index=False)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("model", choices=["fraud", "credit"])
    parser.add_argument("--fraud-splits", type=Path, default=ROOT / "data/processed")
    parser.add_argument("--credit-csv", type=Path, default=Path(r"D:\FraudShield-Datasets\GiveMeSomeCredit\cs-training.csv"))
    parser.add_argument("--output", type=Path, default=ROOT / "reports/research")
    parser.add_argument("--export", type=Path, help="Stage the validation-selected fitted pipeline for serving")
    args = parser.parse_args()
    with TemporaryDirectory() as temp:
        evaluate(args, temp)
