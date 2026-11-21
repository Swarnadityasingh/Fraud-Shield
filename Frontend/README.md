# FraudShield frontend

Install packages with **npm ci** in this directory. Copy .env.example to .env on first setup, set the API URL and Google web client ID, and start the development server with **npm run dev**. The backend, Google client and browser must agree on the frontend origin.

Run **node --test tests/reports.test.js** for the report filter and CSV regression checks. Use **npm run build** for the production bundle. The workspace uses JavaScript and JSX.

The [project README](../README.md) covers authentication, models, database migrations, example requests and the final verification evidence.
