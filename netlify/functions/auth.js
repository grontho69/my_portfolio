/**
 * Netlify Function: /api/auth
 * Admin login — returns JWT token
 */
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }

  try {
    const { password } = JSON.parse(event.body || '{}')
    if (!password) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Password required' }) }
    if (password !== ADMIN_PASSWORD) return { statusCode: 401, headers, body: JSON.stringify({ error: 'Incorrect password' }) }

    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
    return { statusCode: 200, headers, body: JSON.stringify({ token, message: 'Login successful' }) }
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
  }
}
