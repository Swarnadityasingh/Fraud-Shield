export const PIPELINES = [
  { key: 'fraud', name: 'Transaction fraud', short: 'Fraud', color: 'var(--dashboard-blue)' },
  { key: 'credit_risk', name: 'Credit delinquency', short: 'Credit', color: 'var(--dashboard-copper)' },
]

export function summarizeHistory(history) {
  const pipelines = PIPELINES.map(pipeline => {
    const rows = history.filter(row => row.model_type === pipeline.key)
    return { ...pipeline, total: rows.length,
      positive: rows.filter(row => row.prediction === 1).length,
      negative: rows.filter(row => row.prediction === 0).length,
      other: rows.filter(row => row.prediction !== 0 && row.prediction !== 1).length,
      risks: ['Low', 'Medium', 'High', 'Other'].map(level => ({ name: level,
        value: rows.filter(row => level === 'Other' ? !['Low', 'Medium', 'High'].includes(row.risk_level) : row.risk_level === level).length,
      })),
    }
  })
  const dated = history.flatMap(row => {
    const time = row.created_at ? new Date(row.created_at).getTime() : NaN
    return Number.isFinite(time) ? [{ ...row, time }] : []
  })
  const latest = dated.reduce((max, row) => Math.max(max, row.time), -Infinity)
  const end = Number.isFinite(latest) ? new Date(latest).toISOString().slice(0, 10) : null
  const startTime = end ? Date.parse(end + 'T00:00:00Z') - 29 * 86400000 : null
  const activity = []
  if (startTime !== null) {
    const byDay = new Map()
    for (let offset = 0; offset < 30; offset++) {
      const date = new Date(startTime + offset * 86400000).toISOString().slice(0, 10)
      const point = { date, fraud: 0, credit_risk: 0, other: 0 }
      byDay.set(date, point); activity.push(point)
    }
    for (const row of dated) {
      const point = byDay.get(new Date(row.time).toISOString().slice(0, 10))
      if (point) point[PIPELINES.some(p => p.key === row.model_type) ? row.model_type : 'other']++
    }
  }
  return { total: history.length, pipelines,
    otherModels: history.filter(row => !PIPELINES.some(p => p.key === row.model_type)).length,
    highRisk: history.filter(row =>
  ['fraud', 'credit_risk'].includes(row.model_type) &&
  row.risk_level === 'High'
).length,
    activity, activityStart: activity[0]?.date, activityEnd: end, undated: history.length - dated.length,
    recent: [...history].sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0)),
  }
}
