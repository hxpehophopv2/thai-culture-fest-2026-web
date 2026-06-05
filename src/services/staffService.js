import { API_BASE_URL } from '@/config/api'

// ============================================================
// DEV MODE: เปลี่ยนเป็น false เมื่อต้องการเชื่อมต่อ API จริง
// เมื่อเปิด (true) ทุกฟังก์ชันจะคืนค่า mock data แทนการเรียก API
// ============================================================
const STAFF_DEV_MODE = false
const DEV_DELAY_MS = 600

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
    const error = new Error(
      payload?.error?.message || `Request failed with status ${response.status}`,
    )
    error.status = response.status
    error.code = payload?.error?.code
    throw error
  }

  return payload
}

/**
 * @param {string} boothCode - Zone booth code in format 'XXX-XXXX'
 * @returns {Promise<{ sessionId: string, activity: object }>}
 */
export async function staffLogin(boothCode) {
  // DEV MODE: คืน mock session โดยไม่เรียก API
  if (STAFF_DEV_MODE) {
    await new Promise((r) => setTimeout(r, DEV_DELAY_MS))
    return {
      sessionId: 'dev-session-00001',
      activity: {
        zone: boothCode.split('-')[0],
        nameTh: 'โซนทดสอบ (Dev)',
        name: 'Test Zone (Dev)',
      },
    }
  }
  const response = await staffApiRequest('/api/staff/login', {
    method: 'POST',
    body: { boothCode },
  })
  return response.data
}

/**
 * @returns {Promise<{ sessionId: string, activityName: string, boothCode: string } | null>}
 */
export async function getActiveStaffSession() {
  // DEV MODE: คืน mock active session
  if (STAFF_DEV_MODE) {
    await new Promise((r) => setTimeout(r, DEV_DELAY_MS))
    return {
      sessionId: 'dev-session-00001',
      activityName: 'Test Zone (Dev)',
      boothCode: 'DEV-TEST',
    }
  }
  const response = await staffApiRequest('/api/staff/session/active')
  return response.data
}

/**
 * @param {string} qrData - Raw QR code string scanned from participant badge
 * @returns {Promise<{ result: string, message?: string, person?: object, scanLogId?: string }>}
 */
export async function scanCheckin(qrData) {
  // DEV MODE: คืน mock scan result
  // เปลี่ยน mockResult เพื่อทดสอบสถานะอื่น: 'already_stamped', 'wrong_time', 'no_booking', 'rejected'
  if (STAFF_DEV_MODE) {
    await new Promise((r) => setTimeout(r, DEV_DELAY_MS))
    const mockResult = 'checked_in'
    return {
      result: mockResult,
      message: 'เช็คอินเข้างานสำเร็จ (Dev)',
      person: { name: 'นายทดสอบ สแกนผ่าน', shortCode: qrData.slice(0, 5).toUpperCase() },
      scanLogId: 'dev-log-001',
    }
  }
  const response = await staffApiRequest('/api/checkin/scan', {
    method: 'POST',
    body: { qrData },
  })
  return response.data
}

/**
 * @param {string} scanLogId
 * @param {string} [note]
 * @returns {Promise<{ ok: boolean, success: boolean, message: string }>}
 */
export async function overrideScan(scanLogId, note = '') {
  // DEV MODE: คืน mock override result
  if (STAFF_DEV_MODE) {
    await new Promise((r) => setTimeout(r, DEV_DELAY_MS))
    return { ok: true, success: true, message: 'อนุมัติพิเศษเรียบร้อย (Dev)' }
  }
  return await staffApiRequest(`/api/checkin/${scanLogId}/override`, {
    method: 'POST',
    body: { note },
  })
}

/**
 * @param {string} scanLogId
 * @param {string} [note]
 * @returns {Promise<{ ok: boolean, success: boolean, message: string }>}
 */
export async function rejectScan(scanLogId, note = '') {
  // DEV MODE: คืน mock reject result
  if (STAFF_DEV_MODE) {
    await new Promise((r) => setTimeout(r, DEV_DELAY_MS))
    return { ok: true, success: true, message: 'ปฏิเสธเช็คอินเรียบร้อย (Dev)' }
  }
  return await staffApiRequest(`/api/checkin/${scanLogId}/reject`, {
    method: 'POST',
    body: { note },
  })
}

/**
 * @returns {Promise<Array<object>>}
 */
export async function getActivityBookings() {
  // DEV MODE: คืน mock bookings list
  if (STAFF_DEV_MODE) {
    await new Promise((r) => setTimeout(r, DEV_DELAY_MS))
    return [
      {
        bookingId: 'dev-b1',
        startTime: '10:00',
        endTime: '11:00',
        person: {
          id: '1',
          name: 'สมชาย ใจดี',
          nickname: 'ชาย',
          org: 'ม.เกษตร',
          shortCode: 'A1B2C',
        },
        isAttended: true,
      },
      {
        bookingId: 'dev-b2',
        startTime: '10:00',
        endTime: '11:00',
        person: {
          id: '2',
          name: 'สมหญิง รักเรียน',
          nickname: 'หญิง',
          org: 'ม.ธรรมศาสตร์',
          shortCode: 'D3E4F',
        },
        isAttended: false,
      },
      {
        bookingId: 'dev-b3',
        startTime: '13:00',
        endTime: '14:00',
        person: {
          id: '3',
          name: 'นายทดสอบ ระบบ',
          nickname: 'เทส',
          org: 'Dev Team',
          shortCode: 'X9Y8Z',
        },
        isAttended: false,
      },
    ]
  }
  const response = await staffApiRequest('/api/checkin/bookings')
  return response.data
}
