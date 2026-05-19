import { API_BASE_URL } from '@/config/api'
import { getLineAccessToken } from '@/services/lineAuthService'

async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const accessToken = getLineAccessToken()
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || payload?.ok === false) {
    console.error('[API Error]', {
      url: `${API_BASE_URL}${path}`,
      status: response.status,
      payload,
    })
    const details = payload?.error?.details?.map((item) => item.message).join('\n')
    const error = new Error(
      details || payload?.error?.message || `Request failed with status ${response.status}`,
    )
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

function mapParticipantType(type) {
  if (type === 'SPECIAL_GUEST') return 'GUEST'
  return type || 'GENERAL_PUBLIC'
}

function mapNationalityType(nationality) {
  return nationality === 'TH' || nationality === 'THAI' ? 'THAI' : 'NON_THAI'
}

function mapRegistrationPayload(formData, fallbackSessionIds = []) {
  const nationalityType = mapNationalityType(formData.nationality)
  const participantType = mapParticipantType(formData.participantType)
  const faculty = formData.faculty === 'other' ? 'OTHER' : formData.faculty
  const department = formData.department === 'other' ? 'OTHER' : formData.department

  return {
    nationalityType,
    firstName: formData.firstName,
    lastName: formData.lastName,
    nickname: formData.nickname,
    dateOfBirth: formData.dateOfBirth,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    country: nationalityType === 'NON_THAI' ? formData.nationality : undefined,
    participantType,
    organization:
      participantType === 'GENERAL_PUBLIC'
        ? formData.organization || 'General Public'
        : formData.organization,
    faculty: participantType === 'STUDENT' ? faculty : undefined,
    facultyOther: faculty === 'OTHER' ? formData.facultyOther : undefined,
    department: participantType === 'STUDENT' ? department : undefined,
    departmentOther: department === 'OTHER' ? formData.departmentOther : undefined,
    pdpaConsent: Boolean(formData.pdpaConsent ?? formData.consent),
    mediaConsent: Boolean(formData.mediaConsent ?? formData.consent),
    selectedSessionIds: formData.selectedSessionIds?.length
      ? formData.selectedSessionIds
      : fallbackSessionIds,
  }
}

export async function getActivities() {
  const response = await apiRequest('/api/activities')
  return response.data
}

export async function getMyRegistration() {
  const response = await apiRequest('/api/registration/me')
  return response.data
}

export async function getMyQr() {
  const response = await apiRequest('/api/registration/me/qr')
  return response.data
}

export async function submitRegistration(formData, fallbackSessionIds = []) {
  const payload = mapRegistrationPayload(formData, fallbackSessionIds)
  const response = await apiRequest('/api/registration', {
    method: 'POST',
    body: payload,
  })
  return response.data
}

export async function updateMyRegistration(payload) {
  const response = await apiRequest('/api/registration/me', {
    method: 'PUT',
    body: payload,
  })
  return response.data
}
