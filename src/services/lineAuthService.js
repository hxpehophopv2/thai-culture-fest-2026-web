import liff from '@line/liff'

let initPromise
let authState = {
  accessToken: '',
  profile: null,
}

export async function initLineAuth(redirectPath = '/register') {
  if (authState.profile) {
    return { redirected: false, ...authState }
  }

  const liffId = import.meta.env.VITE_LIFF_ID

  if (!liffId) {
    throw new Error('Missing VITE_LIFF_ID')
  }

  if (!initPromise) {
    initPromise = liff.init({ liffId })
  }

  await initPromise

  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: `${window.location.origin}${redirectPath}` })
    return { redirected: true, accessToken: '', profile: null }
  }

  authState = {
    accessToken: liff.getAccessToken() || '',
    profile: await liff.getProfile(),
  }

  if (!authState.accessToken) {
    throw new Error('Cannot get LINE access token')
  }

  return { redirected: false, ...authState }
}

export function getLineAccessToken() {
  return authState.accessToken
}

export function getLineProfile() {
  return authState.profile
}
