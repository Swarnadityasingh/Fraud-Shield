import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

let server, DashboardHome
before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  DashboardHome = (await server.ssrLoadModule('/src/pages/DashboardHome.jsx')).default
})
after(async () => { await server?.close() })

function render(historyState, history = [], historyError = '') {
  return renderToStaticMarkup(React.createElement(DashboardHome, {
    userName: 'Test', notifications: [], history, historyState, historyError,
    onNavigate() {}, onReload() {},
  }))
}

test('loading state contains no zero-valued stat cards or populated analytics', () => {
  const html = render('loading')
  assert.match(html, /Loading your workspace/)
  assert.doesNotMatch(html, /stat-card-value|overview-charts|Recent predictions/)
})

test('API failure hides even previously supplied records and offers retry', () => {
  const html = render('error', [{ id: 777, model_type: 'fraud', prediction: 1 }], 'Connection unavailable')
  assert.match(html, /Prediction history is unavailable/)
  assert.match(html, /Connection unavailable/)
  assert.match(html, /Retry loading history/)
  assert.doesNotMatch(html, /stat-card-value|overview-charts|#777/)
})

test('successfully loaded empty history shows real zeroes and an explicit empty state', () => {
  const html = render('ready')
  assert.equal((html.match(/class="stat-card-value">0</g) || []).length, 4)
  assert.match(html, /No saved predictions were returned for your account/)
  assert.doesNotMatch(html, /overview-charts/)
})

test('populated state renders separate pipeline classifications and preserves a zero model score', () => {
  const html = render('ready', [
    { id: 1, model_type: 'fraud', prediction: 0, probability: 0, risk_level: 'Low', created_at: '2026-11-18T00:00:00Z' },
    { id: 2, model_type: 'credit_risk', prediction: 1, probability: 0.8, risk_level: 'High', created_at: '2026-11-18T01:00:00Z' },
  ])
  assert.match(html, /Classification breakdown/)
  assert.match(html, /No serious delinquency/)
  assert.match(html, /Legitimate/)
  assert.match(html, /0\.00%/)
  assert.match(html, /Recorded usage, not an accuracy or performance comparison/)
})
