import test from 'node:test'
import assert from 'node:assert/strict'
import { predictionCsv, filterPredictions } from '../src/services/reports.js'

const history = [
  { id: 2, created_at: '2026-01-02T12:30:00Z', model_type: 'credit_risk', prediction: 0, probability: 0, risk_level: 'Low' },
  { id: 1, created_at: '2026-01-02T12:00:00Z', model_type: 'fraud', prediction: 1, probability: 0.86, risk_level: 'High' },
]
const header = 'id,created_at,model_type,prediction,probability,risk_level'

test('CSV export follows the reports model filter and preserves zero values', () => {
  assert.equal(predictionCsv(filterPredictions(history, 'credit_risk')),
    header + '\r\n2,2026-01-02T12:30:00Z,credit_risk,0,0,Low')
  assert.equal(predictionCsv(filterPredictions(history, 'fraud')),
    header + '\r\n1,2026-01-02T12:00:00Z,fraud,1,0.86,High')
})

test('both-model report preserves history order and empty history has a header', () => {
  const lines = predictionCsv(filterPredictions(history, '')).split('\r\n')
  assert.equal(lines.length, 3)
  assert.match(lines[1], /^2,/)
  assert.match(lines[2], /^1,/)
  assert.equal(predictionCsv([]), header)
})
