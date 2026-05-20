import { API_BASE_URL } from '@/config/api'

async function staffApiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {})
  headers.set('Accept', 'application/json')

  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const sessionId = localStorage.getItem('staff_session_id')
  if (sessionId) {
    headers.set('X-Staff-Session', sessionId)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || payload?.ok === false) {
    const error = new Error(payload?.error?.message || `Request failed with status ${response.status}`)
    error.status = response.status
    error.code = payload?.error?.code
    throw error
  }

  return payload
}

export async function staffLogin(boothCode) {
  const response = await staffApiRequest('/api/staff/login', {
    method: 'POST',
    body: { boothCode },
  })
  return response.data
}

export async function getActiveStaffSession() {
  const response = await staffApiRequest('/api/staff/session/active')
  return response.data
}

export async function scanCheckin(qrData) {
  const response = await staffApiRequest('/api/checkin/scan', {
    method: 'POST',
    body: { qrData },
  })
  return response.data
}
