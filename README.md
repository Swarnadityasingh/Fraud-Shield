# FraudShield

FraudShield is an experimental financial transaction risk monitoring prototype. It combines a React dashboard with a FastAPI service that scores transactions using a scikit-learn Random Forest model.

> **Prototype notice:** The model is trained on a synthetic transaction dataset. Predictions are experimental and are not proof of fraud or suitable as the sole basis for financial decisions. Dashboard totals and chart values are illustrative sample data.

## Features

- Analyze a transaction by amount and transaction type.
- Return a predicted class (fraudulent or legitimate), fraud probability, and risk level.
- Check backend and model status through a health endpoint.
- Configure risk thresholds and notification preferences in the dashboard.
- View illustrative transaction summary cards and a sample weekly activity chart.

## Project structure

```text
financial-risk-framework/
├── Backend/
│   ├── app/
│   │   └── main.py
│   ├── data/
│   │   └── transactions.csv       # Required training dataset
│   ├── reports/
│   │   ├── metrics.json           # Saved held-out evaluation results
│   │   └── confusion_matrix.png
│   ├── tests/
│   │   └── test_api.py
│   └── training/
│       └── train.py
└── Frontend/
    └── src/
        ├── components/
        ├── services/api.js
        └── App.jsx
```

## Requirements

- Python with the packages listed in `Backend/requirements.txt`
- Node.js and npm
- The transaction dataset at `Backend/data/transactions.csv`, with columns `step`, `type`, `amount`, and `isFraud`

## Setup and run

Open two terminals from the `financial-risk-framework` directory.

### 1. Train the model

```bash
cd Backend
python -m venv .venv
# Activate the virtual environment, then:
pip install -r requirements.txt
python training/train.py
```

Training uses all fraud records and samples up to 200,000 legitimate records, then creates a stratified 80/20 train/test split with random state 42. It saves the trained model to `Backend/app/fraud_model.joblib` and evaluation artifacts under `Backend/reports/`.

### 2. Start the API

In the Backend directory, with the environment activated:

```bash
uvicorn app.main:app --reload
```

The API listens on `http://127.0.0.1:8000` by default.

### 3. Start the dashboard

In another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). The frontend uses `http://127.0.0.1:8000` by default. To use another backend URL, set `VITE_API_URL` in the frontend environment before starting Vite.

## API

### `GET /`

Returns a basic API-running message.

### `GET /health`

Returns service health and whether a model was loaded, for example:

```json
{
  "status": "healthy",
  "model_connected": true
}
```

### `POST /predict`

Request body:

```json
{
  "amount": 2500.0,
  "transaction_type": "TRANSFER",
  "step": 1
}
```

`amount` must be greater than zero. `step` defaults to 1 and must be between 1 and 744. The response includes `prediction`, `fraud_probability`, `risk_level`, and a prototype disclaimer. The service assigns risk levels using probability thresholds of 0.30 and 0.70. The dashboard can apply its configured thresholds to the displayed risk level.

## Saved evaluation results

The archive's `Backend/reports/metrics.json` reports results on a held-out set of 41,643 records (40,000 legitimate and 1,643 fraud):

| Metric | Result |
|---|---:|
| Accuracy | 94.35% |
| Fraud precision | 39.10% |
| Fraud recall | 77.60% |
| Fraud F1 | 0.520 |
| ROC-AUC | 0.957 |
| PR-AUC | 0.717 |

The confusion matrix records 1,275 true positives, 368 false negatives, 1,986 false positives, and 38,014 true negatives. These are saved experimental results, not a guarantee of performance on real transactions.

## Tests

The backend contains API tests for the root endpoint and rejection of an invalid prediction request. Run them from `Backend` with the project dependencies installed:

```bash
pytest
```

The archive includes the test source files but does not establish that the tests were run successfully.
