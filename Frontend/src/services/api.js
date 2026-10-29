
const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export async function predictTransaction(payload) {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Prediction failed')
  }

  return data
}

export async function getModelStatus() {
  const response = await fetch(`${API_URL}/health`)

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`)
  }

  return response.json()
}
