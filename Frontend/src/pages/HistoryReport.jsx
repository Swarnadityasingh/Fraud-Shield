import { useState } from 'react'
import { filterPredictions, predictionCsv } from '../services/reports'
import TransactionTable from '../components/TransactionTable'

function download(rows) {
  const csv = predictionCsv(rows)
  const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}))
  const link = document.createElement('a')
  link.href = url
  link.download = 'fraudshield-predictions.csv'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function HistoryReport({ page, history, ready }) {
  const [filter, setFilter] = useState('')
  const rows = filterPredictions(history, filter)
  return <section className="research-panel">
    <h1>{page}</h1>
    <label>Model <select value={filter} onChange={e => setFilter(e.target.value)}>
      <option value="">Both models</option><option value="fraud">Transaction fraud</option>
      <option value="credit_risk">Credit delinquency</option></select></label>
    {page !== 'Reports' && <div className="risk-bands">
      {['fraud','credit_risk'].filter(kind => !filter || filter === kind).map(kind => {
        const subset = rows.filter(r => r.model_type === kind)
        return <section key={kind}><h2>{kind === 'fraud' ? 'Transaction fraud' : 'Credit delinquency'}</h2>
          <p>{subset.length} predictions · {subset.filter(r => r.prediction === 1).length} flagged</p>
          {['Low','Medium','High'].map(level => {
            const count = subset.filter(r => r.risk_level === level).length
            return <label key={level}>{level} risk <progress value={count} max={subset.length || 1} /> {count}</label>
          })}</section>
      })}
    </div>}
    {page === 'Reports' && <div className="report-tools">
      <button disabled={!ready || !rows.length} onClick={() => download(rows)}>Download CSV</button>
      <button disabled={!ready || !rows.length} onClick={() => window.print()}>Print / Save PDF</button>
    </div>}
    <TransactionTable history={rows} />
  </section>
}
