export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

export async function request(path, token, options = {}) {
  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      ...(token && { Authorization: 'Bearer ' + token }),
      ...(options.body && { 'Content-Type': 'application/json' }),
    },
  })
  if (!response.ok) {
    const { detail } = await response.json().catch(() => ({}))
    if (response.status === 401) throw new Error('Your session expired. Sign in again.')
    const issues = detail?.errors || [
      ...(detail?.missing_features || []).map(key => 'Missing ' + key),
      ...(detail?.unexpected_features || []).map(key => 'Unexpected ' + key),
    ]
    throw new Error([typeof detail === 'string' ? detail : detail?.message || 'Request failed (' + response.status + ')',
      ...issues.slice(0, 4)].join(' · '))
  }
  return response.json()
}

export const getModelStatus = () => request('/health')

export async function loadHistory(token, signal) {
  const records = new Map()
  let offset = 0
  let page
  do {
    page = await request('/history?limit=100&offset=' + offset, token, { signal })
    for (const row of page.records) records.set(row.id, row)
    offset += page.records.length
  } while (offset < page.total && page.records.length)
  return [...records.values()]
}
