/**
 * Netlify Function: /api/upload
 * Uploads images directly to ImgBB
 */
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret'
const IMGBB_API_KEY = process.env.IMGBB_API_KEY

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function verifyToken(event) {
  const token = event.headers?.authorization?.replace('Bearer ', '')
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) }

  const admin = verifyToken(event)
  if (!admin) return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Unauthorized' }) }

  try {
    const { image, apiKey: customKey } = JSON.parse(event.body || '{}')
    if (!image) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'No image provided' }) }

    const apiKey = customKey || IMGBB_API_KEY
    if (!apiKey) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'ImgBB API Key is required. Please set IMGBB_API_KEY in environment variables.' })
      }
    }

    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image

    const formData = new FormData()
    formData.append('image', base64Data)

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (!data.success) {
      return {
        statusCode: res.status || 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: data.error?.message || 'ImgBB upload failed' })
      }
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        url: data.data.url,
        display_url: data.data.display_url,
        thumb_url: data.data.thumb?.url,
        delete_url: data.data.delete_url,
      })
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message })
    }
  }
}
