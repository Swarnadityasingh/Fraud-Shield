import { useState, useEffect } from 'react'
import { request } from '../services/api'

export default function PredictionForm({ kind, token, onSaved }) {
  const fraud = kind === 'fraud'
  const [keys, setKeys] = useState([])
  const [text, setText] = useState('')
  const [values, setValues] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setError('')
    request('/predict/' + kind + '/schema', token, { signal: controller.signal })
      .then(data => setKeys(data.features))
      .catch(e => { if (!controller.signal.aborted) setError(e.message) })
    return () => controller.abort()
  }, [kind, token, retry])

  async function submit(event) {
    event.preventDefault()
    setError('')
    setResult(null)
    setBusy(true)
    try {
      let features
      if (fraud) {
        const parsed = JSON.parse(text)
        features = parsed?.features ?? parsed
        if (!features || typeof features !== 'object' || Array.isArray(features)) throw new Error('Enter a JSON feature object.')
      } else {
        features = Object.fromEntries(keys.map(key => [key, values[key] ? Number(values[key]) : null]))
      }
      if (!Object.values(features).some(value => value !== null)) throw new Error('Enter at least one observed feature.')
      const data = await request('/predict/' + kind, token, { method: 'POST', body: JSON.stringify({ features }) })
      setResult(data)
      onSaved(data, kind)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return <section className="research-panel">
    <h1>{fraud ? 'Fraud detection' : 'Credit risk'}</h1>
    <p>{fraud ? 'Score an IEEE-CIS transaction.' : 'Estimate the probability of serious delinquency within two years.'}</p>
    {error && <p role="alert">{error} {!keys.length && <button onClick={() => setRetry(n => n + 1)}>Retry</button>}</p>}
    {!keys.length && !error && <p role="status">Loading model fields…</p>}
    {!!keys.length && <form onSubmit={submit}>
      {fraud ? <>
        <label htmlFor="features">Transaction features · {keys.length} fields</label>
        <p>Paste one feature record. Use null for a missing observation.</p>
        <button type="button" onClick={() => setText(JSON.stringify(Object.fromEntries(keys.map(k => [k, null])), null, 2))}>Load blank template</button>
        <textarea id="features" rows="12" required value={text} onChange={e => setText(e.target.value)} />
      </> : <><p>Leave missing observations blank.</p><div className="credit-fields">{keys.map(key =>
        <label key={key}>{key}<input type="number" step="any" value={values[key] || ''}
          onChange={e => setValues({ ...values, [key]: e.target.value })} /></label>)}</div></>}
      <button className="score-btn" disabled={busy}>{busy ? 'Scoring…' : 'Run prediction'}</button>
    </form>}
    {result && <section className="score-result" role="status">
      <h2>{result.prediction_label}</h2>
      <p>Class {result.prediction} · {(result.probability * 100).toFixed(2)}% {fraud ? 'fraud' : 'delinquency'} probability · {result.risk_level} risk</p>
      <small>{result.model} · Saved prediction #{result.history_id}</small>
    </section>}
  </section>
}
