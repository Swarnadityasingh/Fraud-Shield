# FraudShield manuscript review stage v1

This new directory contains manuscript drafting and demonstration planning outputs. Original source, model artifacts, metrics, plots and the preservation package are not edited. No fitting, scoring, HTTP submission, database operation or screenshot capture is part of this stage.

## Review order

1. `manuscript.md`: complete content draft with Abstract, Sections I–VIII, four research tables and references. Start review with Introduction through Experimental Results. It is not yet venue-specific two-column typesetting.
2. `literature-review.md` and `references.bib`: six verified foundational publications, dataset reference placeholders, verification sources and remaining coverage/metadata checks.
3. `evidence-map.md` and `tables-and-figures.md`: authoritative frozen inputs, claim boundaries and existing-figure placement.
4. `demo-selection-manifest.json`: four real holdout examples, membership checks and input hashes. Companion `demo-*.json` files contain only model feature inputs.
5. `demo-execution-plan.md`: bounded future application workflow, acceptance checks and stop conditions. Live submissions and screenshots require separate approval.
6. `verification-register.md`: unresolved claims, limitations and minimum verification requirements.

## Selection preparation

`prepare_demo_manifest.py` reads the preserved baseline, reconstructs the documented credit split and validates IEEE-CIS membership/raw-source values. It selects the smallest source ID within each true class of each holdout without scoring records. It uses exclusive file creation and refuses to overwrite outputs; do not rerun it in this directory after successful generation. The original evaluation/replay scripts are never executed.

Review selection provenance as a four-case integration plan, not a new experiment. True labels remain metadata in the manifest and never enter model payloads. Source hashes link the examples to the preserved public datasets and model artifacts.
