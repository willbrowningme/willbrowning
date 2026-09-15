const SENDY_URL = process.env.SENDY_URL || 'https://sendy.willbrowning.me/subscribe'
const SENDY_LIST_ID = process.env.SENDY_LIST_ID || 'G4t7tNFm3f6qoxz4mHaywQ'

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

function clientIp(headers) {
  return (
    headers['x-nf-client-connection-ip'] ||
    (headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    ''
  )
}

function parseBody(event) {
  if (!event.body) {
    return {}
  }

  const contentType = (event.headers['content-type'] || event.headers['Content-Type'] || '')
    .toLowerCase()

  if (contentType.includes('application/json')) {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body
    return JSON.parse(raw)
  }

  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body
  return Object.fromEntries(new URLSearchParams(raw))
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { message: 'Method not allowed' })
  }

  let payload
  try {
    payload = parseBody(event)
  } catch (err) {
    return json(400, { message: 'Invalid request body' })
  }

  const email = String(payload.email || '').trim()
  const token = String(payload.token || payload['cf-turnstile-response'] || '').trim()
  const hp = String(payload.hp || '')

  if (hp) {
    return json(200, { message: 'Thanks. Please check your email.' })
  }

  if (!email || !email.includes('@') || email.length > 254) {
    return json(400, { message: 'Please enter a valid email address.' })
  }

  if (!token || token.length > 2048) {
    return json(400, { message: 'Please complete the spam check.' })
  }

  const secret = process.env.TURNSTILE_SECRET
  const sendyKey = process.env.SENDY_API_KEY

  if (!secret || !sendyKey) {
    return json(500, { message: 'Subscription is not configured.' })
  }

  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: clientIp(event.headers)
    })
  })

  const result = await verify.json()
  if (!result.success) {
    return json(400, { message: 'The spam check failed. Please try again.' })
  }

  const sendy = await fetch(SENDY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      api_key: sendyKey,
      email,
      list: SENDY_LIST_ID,
      boolean: 'true',
      gdpr: 'true',
      hp: '',
      ipaddress: clientIp(event.headers)
    })
  })

  const text = (await sendy.text()).trim()

  if (text === '1' || text === 'true') {
    return json(200, { message: 'Thanks. Please check your email.' })
  }

  if (/already subscribed/i.test(text)) {
    return json(200, { message: 'You are already subscribed.' })
  }

  return json(400, { message: 'Subscription failed. Please try again.' })
}
