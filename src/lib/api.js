/**
 * Centralized API Client
 * All API calls go through here — makes it easy to switch endpoints later
 */

const BASE = '/api'

function getToken() {
  return localStorage.getItem('portfolio_admin_token')
}

function authHeaders() {
  const token = getToken()
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

async function request(url, options = {}) {
  const res = await fetch(url, options)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

// ─── Auth ─────────────────────────────────────────────────────
export const api = {
  auth: {
    login: (password) =>
      request(`${BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      }),
  },

  // ─── Blog Posts ─────────────────────────────────────────────
  posts: {
    getAll: (adminAll = false) =>
      request(`${BASE}/posts${adminAll ? '?all=true' : ''}`, {
        headers: adminAll ? authHeaders() : { 'Content-Type': 'application/json' },
      }),

    getBySlug: (slug) => request(`${BASE}/posts?slug=${encodeURIComponent(slug)}`),

    getById: (id) =>
      request(`${BASE}/posts?id=${id}`, { headers: authHeaders() }),

    create: (data) =>
      request(`${BASE}/posts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),

    update: (id, data) =>
      request(`${BASE}/posts?id=${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),

    delete: (id) =>
      request(`${BASE}/posts?id=${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }),
  },

  // ─── Projects ───────────────────────────────────────────────
  projects: {
    getAll: (adminAll = false) =>
      request(`${BASE}/projects${adminAll ? '?all=true' : ''}`, {
        headers: adminAll ? authHeaders() : { 'Content-Type': 'application/json' },
      }),

    getById: (id) =>
      request(`${BASE}/projects?id=${id}`, { headers: authHeaders() }),

    create: (data) =>
      request(`${BASE}/projects`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),

    update: (id, data) =>
      request(`${BASE}/projects?id=${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),

    delete: (id) =>
      request(`${BASE}/projects?id=${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }),
  },

  // ─── Image Upload (ImgBB) ───────────────────────────────────
  upload: {
    image: (base64OrDataUrl, apiKey) =>
      request(`${BASE}/upload`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ image: base64OrDataUrl, apiKey }),
      }),
  },
}
