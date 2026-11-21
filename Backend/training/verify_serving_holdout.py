"""Replay the frozen serving pipelines against the original labeled holdouts."""
import argparse
import hashlib
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import pyarrow.parquet as pq
from sklearn.metrics import (
    accuracy_score, auc, average_precision_score, confusion_matrix, f1_score,
    precision_recall_curve, precision_score, recall_score, roc_auc_score,
)
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parents[1]


def credit_holdout(path):
    data = pd.read_csv(path)
    _, held = train_test_split(data, test_size=0.30, random_state=42, stratify=data.SeriousDlqin2yrs)
    _, test = train_test_split(held, test_size=0.5, random_state=42, stratify=held.SeriousDlqin2yrs)
    yield test


def verify(model_path, batches, target, metrics_path):
    pipeline = joblib.load(model_path)
    pipeline.named_steps['classifier'].set_params(n_jobs=1)
    scores, labels, transformed = [], [], []
    for frame in batches:
        transformed.append(pipeline.named_steps['preprocessor'].transform(frame.loc[:, pipeline.feature_names_in_]).astype('float32'))
        scores.extend(pipeline.predict_proba(frame.loc[:, pipeline.feature_names_in_])[:, list(pipeline.classes_).index(1)])
        labels.extend(frame[target])
    scores = np.asarray(scores)
    classifier = pipeline.named_steps["classifier"]
    offline = classifier.predict_proba(np.concatenate(transformed))[:, list(classifier.classes_).index(1)]
    score_delta = float(np.max(np.abs(scores - offline)))
    np.testing.assert_allclose(scores, offline, atol=1e-12, rtol=0)
    pred = scores >= pipeline.decision_threshold_
    assert np.array_equal(pred, offline >= pipeline.decision_threshold_)
    expected = pd.read_csv(metrics_path).query("selected").squeeze()
    tn, fp, fn, tp = confusion_matrix(labels, pred, labels=[0, 1]).ravel().tolist()
    precision, recall, _ = precision_recall_curve(labels, scores)
    measured = dict(threshold=pipeline.decision_threshold_, accuracy=accuracy_score(labels, pred),
                    precision=precision_score(labels, pred), recall=recall_score(labels, pred),
                    f1=f1_score(labels, pred), roc_auc=roc_auc_score(labels, scores),
                    pr_auc=auc(recall, precision), average_precision=average_precision_score(labels, scores),
                    tn=tn, fp=fp, fn=fn, tp=tp)
    for metric, actual in measured.items():
        np.testing.assert_allclose(actual, expected[metric], rtol=0, atol=1e-12, err_msg=metric)
    with model_path.open("rb") as source:
        digest = hashlib.file_digest(source, "sha256").hexdigest()
    return dict(file=model_path.name, sha256=digest, features=pipeline.n_features_in_,
                class_weight=pipeline.named_steps["classifier"].class_weight,
                rows=len(labels), max_absolute_api_path_vs_classifier_score_delta=score_delta, **measured)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fraud-holdout", type=Path, default=ROOT / "data/processed/holdout.parquet")
    parser.add_argument("--credit-csv", type=Path, default=Path(r"D:\FraudShield-Datasets\GiveMeSomeCredit\cs-training.csv"))
    args = parser.parse_args()
    outputs = ROOT / "reports/research"
    fraud = (batch.to_pandas() for batch in pq.ParquetFile(args.fraud_holdout).iter_batches(batch_size=4096))
    evidence = {}
    for name, rows, target in [("fraud", fraud, "isFraud"), ("credit", credit_holdout(args.credit_csv), "SeriousDlqin2yrs")]:
        evidence[name] = verify(ROOT / "app/models" / f"{name}_selected.joblib", rows,
                                target, outputs / name / "test_metrics.csv")
    (outputs / "serving_holdout.json").write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
    for name, result in evidence.items():
        print(f"{name}: {result['rows']} rows, threshold {result['threshold']}, all metrics matched")
