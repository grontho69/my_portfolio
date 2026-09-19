/**
 * Netlify Function: /api/projects
 * Projects CRUD — uses MongoDB in production
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
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: String,
  image: String,
  tags: [String],
  category: { type: String, default: 'Full Stack' },
  liveLink: String,
  githubLink: String,
  featured: { type: Boolean, default: false },
  highlights: [String],
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true })

let Project
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    Project = Project || mongoose.model('Project', ProjectSchema)
    return
  }
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema)
}

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

    if (method === 'GET') {
      if (params.id) {
        const project = await Project.findById(params.id).lean()
        if (!project) return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Not found' }) }
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(project) }
      }
      const query = (admin && params.all === 'true') ? {} : { published: true }
      const projects = await Project.find(query).sort({ order: 1, createdAt: -1 }).lean()
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(projects) }
    }

    if (!admin) return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Unauthorized' }) }

    const body = JSON.parse(event.body || '{}')

    if (method === 'POST') {
      const count = await Project.countDocuments()
      const project = await Project.create({ ...body, order: body.order ?? count })
      return { statusCode: 201, headers: CORS_HEADERS, body: JSON.stringify(project) }
    }

    if (method === 'PUT') {
      if (!params.id) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'ID required' }) }
      const project = await Project.findByIdAndUpdate(params.id, body, { new: true }).lean()
      if (!project) return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Not found' }) }
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(project) }
    }

    if (method === 'DELETE') {
      if (!params.id) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'ID required' }) }
      await Project.findByIdAndDelete(params.id)
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true }) }
    }

    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) }
  } catch (err) {
    console.error('projects function error:', err)
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) }
  }
}
