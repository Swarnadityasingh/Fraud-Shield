import './TransactionTable.css'

const sampleTransactions = [
  { id: 'TXN-1042', amount: 8500, type: 'PAYMENT', probability: 12, risk: 'Low' },
  { id: 'TXN-1043', amount: 85000, type: 'TRANSFER', probability: 92, risk: 'High' },
  { id: 'TXN-1044', amount: 12000, type: 'CASH_OUT', probability: 35, risk: 'Medium' },
  { id: 'TXN-1045', amount: 950, type: 'PAYMENT', probability: 8, risk: 'Low' },
]

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatTime(value) {
  if (!value) return '—'

  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TransactionTable({ history = [] }) {
  const liveTransactions = history.map((tx) => ({
    id: tx.transaction_id,
    amount: tx.amount,
    type: tx.transaction_type,
    probability: Number(tx.fraud_probability) * 100,
    risk: tx.risk_level,
    createdAt: tx.created_at,
    source: 'Live analysis',
  }))

  const rows = [
    ...liveTransactions,
    ...sampleTransactions.map((tx) => ({
      ...tx,
      source: 'Sample data',
    })),
  ]

  return (
    <section className="transaction-table-panel">
      <div className="transaction-table-heading">
        <div>
          <h2>Recent transactions</h2>
          <p>Monitor transaction activity and risk classifications.</p>
        </div>

        <span className="sample-data-label">
          {liveTransactions.length} live · {sampleTransactions.length} sample
        </span>
      </div>

      <div className="transaction-table-scroll">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Fraud probability</th>
              <th>Risk</th>
              <th>Source / Time</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((tx) => (
              <tr key={tx.id}>
                <td className="transaction-id">{tx.id}</td>
                <td className="transaction-amount">{formatINR(tx.amount)}</td>
                <td>{tx.type?.replace('_', ' ')}</td>
                <td>{Number(tx.probability).toFixed(1)}%</td>
                <td>
                  <span className={`risk-badge risk-${tx.risk.toLowerCase()}`}>
                    {tx.risk}
                  </span>
                </td>
                <td>
                  <span className="transaction-source">
                    {tx.source}
                  </span>
                  {tx.createdAt && (
                    <small className="transaction-time">
                      {formatTime(tx.createdAt)}
                    </small>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="transaction-table-disclaimer">
        Live entries are predictions returned by the connected model.
        Sample entries are illustrative and are not real transactions.
      </p>
    </section>
  )
}
