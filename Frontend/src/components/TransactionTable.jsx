import './TransactionTable.css'

export function predictionLabel(row) {
  if (row.prediction !== 0 && row.prediction !== 1) return 'Other classification'
  if (row.model_type === 'fraud') return row.prediction ? 'Fraudulent' : 'Legitimate'
  if (row.model_type === 'credit_risk') return row.prediction ? 'Serious delinquency' : 'No serious delinquency'
  return 'Other classification'
}

export default function TransactionTable({ history = [] }) {
  if (!history.length) return <div className="table-empty">No saved predictions yet.</div>
  return <div className="transaction-table-scroll" tabIndex={0} role="region" aria-label="Saved predictions table"><table className="transaction-table">
    <thead><tr>{['Prediction ID', 'Model', 'Classification', 'Model score', 'Risk level', 'Saved at'].map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
    <tbody>{history.map(row => {
      const risk = ['Low', 'Medium', 'High'].includes(row.risk_level) ? row.risk_level.toLowerCase() : 'other'
      const knownModel = ['fraud', 'credit_risk'].includes(row.model_type)
      const tone = knownModel && row.prediction === 1 ? 'red' : knownModel && row.prediction === 0 ? 'blue' : 'slate'
      const date = row.created_at ? new Date(row.created_at) : null
      return <tr key={row.id}>
        <td className="transaction-id">#{row.id}</td><td><span className="model-tag">{row.model_type === 'fraud' ? 'Transaction fraud' : row.model_type === 'credit_risk' ? 'Credit delinquency' : 'Other model'}</span></td>
        <td><span className={`classification-badge badge-${tone}`}><i />{predictionLabel(row)}</span></td>
        <td className="model-score">{typeof row.probability === 'number' && Number.isFinite(row.probability) ? `${(100 * row.probability).toFixed(2)}%` : '—'}</td>
        <td><span className={`risk-badge risk-${risk}`}>{risk === 'other' ? 'Other' : row.risk_level}</span></td>
        <td className="saved-time">{date && !Number.isNaN(date.getTime()) ? <time dateTime={date.toISOString()}>{date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}<small>{date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</small></time> : 'Unavailable'}</td>
      </tr>
    })}</tbody>
  </table></div>
}
