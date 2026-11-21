import test from 'node:test'
import assert from 'node:assert/strict'
import { summarizeHistory } from '../src/services/dashboardSummary.js'

// Synthetic unit-test inputs only; never imported into the application.
test('fraud and credit classification totals remain independent', () => {
  const result = summarizeHistory([
    { id: 1, model_type: 'fraud', prediction: 0, risk_level: 'Low' },
    { id: 2, model_type: 'fraud', prediction: 1, risk_level: 'High' },
    { id: 3, model_type: 'credit_risk', prediction: 1, risk_level: 'High' },
    { id: 4, model_type: 'credit_risk', prediction: 1, risk_level: 'Medium' },
  ])
  assert.equal(result.total, 4)
  assert.deepEqual(result.pipelines.map(p => [p.key, p.total, p.positive, p.negative]), [['fraud', 2, 1, 1], ['credit_risk', 2, 2, 0]])
  assert.equal(result.highRisk, 2)
  assert.equal('accuracy' in result, false)
})

test('activity uses UTC calendar days and zeroes only genuinely empty days in its stated window', () => {
  const result = summarizeHistory([
    { id: 1, model_type: 'fraud', created_at: '2026-11-17T23:30:00-02:00' },
    { id: 2, model_type: 'credit_risk', created_at: '2026-11-18T05:00:00Z' },
    { id: 3, model_type: 'fraud', created_at: '2026-09-01T00:00:00Z' },
    { id: 4, model_type: 'fraud', created_at: 'invalid' },
  ])
  assert.equal(result.activity.length, 30)
  assert.equal(result.activityStart, '2026-10-20')
  assert.equal(result.activityEnd, '2026-11-18')
  assert.deepEqual(result.activity.at(-1), { date: '2026-11-18', fraud: 1, credit_risk: 1, other: 0 })
  assert.equal(result.activity.reduce((sum, row) => sum + row.fraud + row.credit_risk, 0), 2)
  assert.equal(result.undated, 1)
  assert.equal(result.total, 4)
})

test('unknown models, labels and risk bands are not silently assigned to credit or Low', () => {
  const result = summarizeHistory([
    { id: 1, model_type: 'legacy', prediction: 1, risk_level: 'Unknown', created_at: '2026-11-18T12:00:00Z' },
    { id: 2, model_type: 'fraud', prediction: null, risk_level: null },
  ])
  assert.equal(result.otherModels, 1)
  assert.equal(result.pipelines[0].other, 1)
  assert.equal(result.pipelines[0].risks.find(r => r.name === 'Other').value, 1)
  assert.equal(result.pipelines[1].total, 0)
  assert.equal(result.activity.at(-1).other, 1)
})

test('empty history has no invented activity dates and summarizing does not mutate history', () => {
  assert.deepEqual(summarizeHistory([]).activity, [])
  const history = Object.freeze([
    Object.freeze({ id: 1, model_type: 'fraud', created_at: '2026-11-01T00:00:00Z' }),
    Object.freeze({ id: 2, model_type: 'fraud', created_at: '2026-11-18T00:00:00Z' }),
  ])
  assert.deepEqual(summarizeHistory(history).recent.map(r => r.id), [2, 1])
  assert.deepEqual(history.map(r => r.id), [1, 2])
})
