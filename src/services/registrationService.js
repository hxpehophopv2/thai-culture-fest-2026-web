import { API_BASE_URL } from '@/config/api'

export async function submitRegistration(formData, lineUserId) {
  const response = await fetch(`${API_BASE_URL}/api/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Line-UserId': lineUserId,
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}
