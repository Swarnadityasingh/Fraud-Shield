const columns = ['id', 'created_at', 'model_type', 'prediction', 'probability', 'risk_level']

export function filterPredictions(history, model) {
  return model ? history.filter(row => row.model_type === model) : history
}

export function predictionCsv(rows) {
  const lines = rows.map(row => columns.map(column => row[column]).join(','))
  return [columns.join(','), ...lines].join('\r\n')
}
