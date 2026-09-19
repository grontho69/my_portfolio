/**
 * Netlify Function: /api/posts
 * Blog post CRUD — uses MongoDB in production, JSON fallback locally
 */
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret'
const MONGODB_URI = process.env.MONGODB_URI

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// ─── MongoDB Model ────────────────────────────────────────────
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  coverImage: String,
  tags: [String],
  published: { type: Boolean, default: false },
}, { timestamps: true })

let Post
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    Post = Post || mongoose.model('Post', PostSchema)
    return
  }
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  Post = mongoose.models.Post || mongoose.model('Post', PostSchema)
}

// ─── JWT Auth ─────────────────────────────────────────────────
function verifyToken(event) {
  const token = event.headers?.authorization?.replace('Bearer ', '')
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

// ─── Handler ──────────────────────────────────────────────────
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS_HEADERS, body: '' }

  const admin = verifyToken(event)
  const params = event.queryStringParameters || {}

  try {
    await connectDB()
    const method = event.httpMethod

    // GET
    if (method === 'GET') {
      if (params.id) {
        const post = await Post.findById(params.id).lean()
        if (!post) return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Not found' }) }
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(post) }
      }
      if (params.slug) {
        const post = await Post.findOne({ slug: params.slug, published: true }).lean()
        if (!post) return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Not found' }) }
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(post) }
      }
      const query = (admin && params.all === 'true') ? {} : { published: true }
      const posts = await Post.find(query).sort({ createdAt: -1 }).lean()
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(posts) }
    }

    // Auth required below
    if (!admin) return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Unauthorized' }) }

    const body = JSON.parse(event.body || '{}')

    // POST — create
    if (method === 'POST') {
      const post = await Post.create(body)
      return { statusCode: 201, headers: CORS_HEADERS, body: JSON.stringify(post) }
    }

    // PUT — update
    if (method === 'PUT') {
      if (!params.id) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'ID required' }) }
      const post = await Post.findByIdAndUpdate(params.id, body, { new: true }).lean()
      if (!post) return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Not found' }) }
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(post) }
    }

    // DELETE
    if (method === 'DELETE') {
      if (!params.id) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'ID required' }) }
      await Post.findByIdAndDelete(params.id)
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true }) }
    }

    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) }
  } catch (err) {
    console.error('posts function error:', err)
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) }
  }
}
