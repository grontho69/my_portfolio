/**
 * FULL-STACK API SERVER
 * ===================================
 * Connects to MongoDB Atlas (from .env) with fallback to JSON store (.local-data/)
 * Supports Admin JWT authentication, Posts CRUD, and Projects CRUD.
 *
 * Run: node server.js
 * Port: 3001 (Vite proxy forwards /api/* → :3001)
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.API_PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret-key-change-in-production'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const MONGODB_URI = process.env.MONGODB_URI
const DATA_DIR = join(__dirname, '.local-data')

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }))
app.use(express.json({ limit: '10mb' }))

// ─── Initial Seed Data (Mahathir's Real Projects & Welcome Post) ─
const INITIAL_PROJECTS = [
  {
    title: 'Volans – E-Commerce Platform',
    description: 'Full-stack modern clothing & apparel platform built for seamless shopping experiences with sleek micro-interactions.',
    longDescription: 'Full-stack modern clothing & apparel platform built for seamless shopping experiences with sleek micro-interactions, complete product catalog, dynamic cart, checkout, and admin management.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js 14', 'MongoDB', 'Tailwind CSS', 'GSAP', 'Stripe'],
    category: 'Full Stack',
    liveLink: 'https://e-commerce-eta-kohl-38.vercel.app/',
    githubLink: 'https://github.com/grontho69',
    featured: true,
    highlights: [
      'Dynamic Cart & Checkout with sleek micro-interactions',
      'Comprehensive Admin Management dashboard',
      'Stripe Payment Gateway integration for secure billing',
      'Secure Auth & Session Handling with optimized MongoDB queries'
    ],
    order: 0,
    published: true,
  },
  {
    title: 'EduTec 1.0 – STEM Exam Engine',
    description: 'High-concurrency online admission exam platform with sub-millisecond ranking algorithms & zero-data-loss architecture.',
    longDescription: 'High-concurrency competitive admission testing platform with an anti-cheat proctoring engine, sub-millisecond leaderboard calculation, and offline resilience.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js 15', 'React 19', 'TypeScript', 'Fastify 5', 'PostgreSQL', 'Drizzle ORM', 'KaTeX', 'Tailwind CSS'],
    category: 'Full Stack',
    liveLink: 'https://web-theta-jade-69.vercel.app/',
    githubLink: 'https://github.com/grontho69/edu_tec_1.0',
    featured: true,
    highlights: [
      'Offline-resilient exam hall powered by IndexedDB',
      'Anti-cheat automated proctoring engine',
      'Top-K Min-Heap real-time leaderboard computation',
      'Topic Dependency DAG & dynamic KaTeX LaTeX rendering'
    ],
    order: 1,
    published: true,
  },
  {
    title: 'ZENJI (ゼンジ) – Cyberpunk Streetwear',
    description: 'High-end cyberpunk & anime-inspired apparel store featuring heavyweight textiles (460–520 GSM) and tactical ergonomics.',
    longDescription: 'Cutting-edge cyberpunk fashion commerce experience with interactive PDP size guide, multi-axis category filters, slide-over cart with free shipping meter, and gamified confetti checkout.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Framer Motion', 'Canvas Confetti'],
    category: 'Frontend',
    liveLink: 'https://zenji-project.vercel.app/',
    githubLink: 'https://github.com/grontho69/zenji-project',
    featured: true,
    highlights: [
      'Multi-axis category & silhouette filter matrix',
      'Dynamic PDP with interactive size guide & visual preview',
      'Framer Motion slide-over cart with free shipping meter',
      'Gamified interactive confetti checkout experience'
    ],
    order: 2,
    published: true,
  },
  {
    title: 'FoodFlow – Restaurant & Delivery Platform',
    description: 'Production-ready culinary operations & delivery ecosystem featuring dedicated workflows for customers, kitchens, and riders.',
    longDescription: 'Complete restaurant and on-demand food delivery architecture uniting 4 discrete operational interfaces: Customer ordering, Kitchen Display System (KDS), Logistics Rider Dispatch, and Admin Control.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Mongoose', 'Leaflet Maps'],
    category: 'Full Stack',
    liveLink: 'https://restuarent-website-flax.vercel.app/',
    githubLink: 'https://github.com/grontho69/restuarent-website',
    featured: true,
    highlights: [
      'Multi-portal UI (Customer, Kitchen KDS, Rider Dispatch, Admin)',
      'Interactive Leaflet map live delivery GPS tracking',
      'Hybrid MongoDB datastore with real-time order states',
      'Cutting edge React 19 & Next.js 16 architecture'
    ],
    order: 3,
    published: true,
  },
]

const INITIAL_POSTS = [
  {
    title: 'Mastering Full Stack Architecture with MERN & NestJS',
    slug: 'mastering-full-stack-architecture-mern-nestjs',
    excerpt: 'A deep dive into building production-ready web apps with clean architecture, scalable MongoDB indexing, and TypeScript.',
    content: `# Mastering Full Stack Architecture with MERN & NestJS\n\nWelcome to my developer blog! In modern software development, choosing the right architecture is just as important as writing clean code.\n\n## Why TypeScript & NestJS for Enterprise Backends?\n\nWhen scaling beyond prototype applications, TypeScript ensures type safety while NestJS enforces structured modular patterns, dependency injection, and comprehensive testing.\n\n\`\`\`typescript\n@Injectable()\nexport class UserService {\n  constructor(private readonly userRepository: UserRepository) {}\n\n  async findById(id: string): Promise<User> {\n    return this.userRepository.findById(id);\n  }\n}\n\`\`\`\n\n## Database Optimization in MongoDB\n\n- Use compound indexes for multi-field queries\n- Avoid unbounded document growth by referencing rather than embedding large arrays\n- Implement lean queries for read-heavy endpoints\n\nStay tuned for more deep dives into cloud deployments and full-stack systems!`,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    tags: ['Architecture', 'MERN', 'NestJS', 'MongoDB', 'TypeScript'],
    published: true,
  }
]

// ─── MongoDB Setup ────────────────────────────────────────────
let isMongoConnected = false

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  coverImage: String,
  tags: [String],
  published: { type: Boolean, default: false },
}, { timestamps: true })

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

const MongoPost = mongoose.model('Post', PostSchema)
const MongoProject = mongoose.model('Project', ProjectSchema)

async function connectMongo() {
  if (!MONGODB_URI) {
    console.log('ℹ️  No MONGODB_URI set — using local JSON storage (.local-data/)')
    return false
  }
  try {
    console.log('⏳ Connecting to MongoDB Atlas...')
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    isMongoConnected = true
    console.log('✅ Connected to MongoDB Atlas!')

    // Auto-seed real projects if collection is empty
    const projCount = await MongoProject.countDocuments()
    if (projCount === 0) {
      console.log('🌱 Seeding real projects to MongoDB Atlas...')
      await MongoProject.insertMany(INITIAL_PROJECTS)
      console.log(`✅ Seeded ${INITIAL_PROJECTS.length} projects to MongoDB!`)
    }

    // Auto-seed welcome post if collection is empty
    const postCount = await MongoPost.countDocuments()
    if (postCount === 0) {
      console.log('🌱 Seeding initial blog post to MongoDB Atlas...')
      await MongoPost.insertMany(INITIAL_POSTS)
      console.log('✅ Seeded initial post to MongoDB!')
    }

    return true
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message)
    console.warn('📁 Falling back to local JSON file store.')
    isMongoConnected = false
    return false
  }
}

// ─── Local JSON File Store Fallback ───────────────────────────
function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

function readStore(name) {
  ensureDataDir()
  const file = join(DATA_DIR, `${name}.json`)
  if (!existsSync(file)) {
    const initial = name === 'projects'
      ? INITIAL_PROJECTS.map((p, i) => ({ ...p, _id: `proj-${i + 1}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }))
      : INITIAL_POSTS.map((p, i) => ({ ...p, _id: `post-${i + 1}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }))
    writeFileSync(file, JSON.stringify(initial, null, 2), 'utf8')
    return initial
  }
  return JSON.parse(readFileSync(file, 'utf8'))
}

function writeStore(name, data) {
  ensureDataDir()
  writeFileSync(join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2), 'utf8')
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// ─── Auth Middleware ──────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized — no token' })
  try {
    req.admin = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ─── AUTH ROUTES ──────────────────────────────────────────────
app.post('/api/auth', (req, res) => {
  const { password } = req.body
  if (!password) return res.status(400).json({ error: 'Password required' })
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Incorrect password' })

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
  res.json({ token, message: 'Login successful' })
})

// ─── BLOG POSTS ROUTES ───────────────────────────────────────
app.get('/api/posts', async (req, res) => {
  try {
    const { all, slug, id } = req.query
    const token = req.headers.authorization?.replace('Bearer ', '')
    let isAdmin = false
    try { jwt.verify(token, JWT_SECRET); isAdmin = true } catch {}

    if (isMongoConnected) {
      if (id) {
        const post = await MongoPost.findById(id).lean()
        return post ? res.json(post) : res.status(404).json({ error: 'Post not found' })
      }
      if (slug) {
        const post = await MongoPost.findOne({ slug, ...(isAdmin && all === 'true' ? {} : { published: true }) }).lean()
        return post ? res.json(post) : res.status(404).json({ error: 'Post not found' })
      }
      const query = (isAdmin && all === 'true') ? {} : { published: true }
      const posts = await MongoPost.find(query).sort({ createdAt: -1 }).lean()
      return res.json(posts)
    }

    // Local JSON Fallback
    const posts = readStore('posts')
    if (id) {
      const post = posts.find(p => p._id === id)
      return post ? res.json(post) : res.status(404).json({ error: 'Post not found' })
    }
    if (slug) {
      const post = posts.find(p => p.slug === slug && p.published)
      return post ? res.json(post) : res.status(404).json({ error: 'Post not found' })
    }
    const result = (isAdmin && all === 'true')
      ? posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : posts.filter(p => p.published).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/posts', requireAuth, async (req, res) => {
  try {
    if (isMongoConnected) {
      const post = await MongoPost.create(req.body)
      return res.status(201).json(post)
    }
    const posts = readStore('posts')
    const post = {
      _id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    posts.push(post)
    writeStore('posts', posts)
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/posts', requireAuth, async (req, res) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Post ID required' })

    if (isMongoConnected) {
      const post = await MongoPost.findByIdAndUpdate(id, req.body, { new: true }).lean()
      return post ? res.json(post) : res.status(404).json({ error: 'Post not found' })
    }

    const posts = readStore('posts')
    const idx = posts.findIndex(p => p._id === id)
    if (idx === -1) return res.status(404).json({ error: 'Post not found' })
    posts[idx] = { ...posts[idx], ...req.body, _id: id, updatedAt: new Date().toISOString() }
    writeStore('posts', posts)
    res.json(posts[idx])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/posts', requireAuth, async (req, res) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Post ID required' })

    if (isMongoConnected) {
      await MongoPost.findByIdAndDelete(id)
      return res.json({ success: true, message: 'Post deleted' })
    }

    const posts = readStore('posts')
    const filtered = posts.filter(p => p._id !== id)
    writeStore('posts', filtered)
    res.json({ success: true, message: 'Post deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PROJECTS ROUTES ─────────────────────────────────────────
app.get('/api/projects', async (req, res) => {
  try {
    const { id, all } = req.query
    const token = req.headers.authorization?.replace('Bearer ', '')
    let isAdmin = false
    try { jwt.verify(token, JWT_SECRET); isAdmin = true } catch {}

    if (isMongoConnected) {
      if (id) {
        const project = await MongoProject.findById(id).lean()
        return project ? res.json(project) : res.status(404).json({ error: 'Project not found' })
      }
      const query = (isAdmin && all === 'true') ? {} : { published: true }
      const projects = await MongoProject.find(query).sort({ order: 1, createdAt: -1 }).lean()
      return res.json(projects)
    }

    // Local JSON Fallback
    const projects = readStore('projects')
    if (id) {
      const project = projects.find(p => p._id === id)
      return project ? res.json(project) : res.status(404).json({ error: 'Project not found' })
    }
    const result = (isAdmin && all === 'true')
      ? projects.sort((a, b) => (a.order || 0) - (b.order || 0))
      : projects.filter(p => p.published !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/projects', requireAuth, async (req, res) => {
  try {
    if (isMongoConnected) {
      const count = await MongoProject.countDocuments()
      const project = await MongoProject.create({ ...req.body, order: req.body.order ?? count })
      return res.status(201).json(project)
    }

    const projects = readStore('projects')
    const project = {
      _id: generateId(),
      ...req.body,
      order: projects.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    projects.push(project)
    writeStore('projects', projects)
    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/projects', requireAuth, async (req, res) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Project ID required' })

    if (isMongoConnected) {
      const project = await MongoProject.findByIdAndUpdate(id, req.body, { new: true }).lean()
      return project ? res.json(project) : res.status(404).json({ error: 'Project not found' })
    }

    const projects = readStore('projects')
    const idx = projects.findIndex(p => p._id === id)
    if (idx === -1) return res.status(404).json({ error: 'Project not found' })
    projects[idx] = { ...projects[idx], ...req.body, _id: id, updatedAt: new Date().toISOString() }
    writeStore('projects', projects)
    res.json(projects[idx])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/projects', requireAuth, async (req, res) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Project ID required' })

    if (isMongoConnected) {
      await MongoProject.findByIdAndDelete(id)
      return res.json({ success: true, message: 'Project deleted' })
    }

    const projects = readStore('projects')
    const filtered = projects.filter(p => p._id !== id)
    writeStore('projects', filtered)
    res.json({ success: true, message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── IMAGE UPLOAD (ImgBB API) ─────────────────────────────────
app.post('/api/upload', requireAuth, async (req, res) => {
  try {
    const { image, apiKey: customKey } = req.body
    if (!image) return res.status(400).json({ error: 'No image data provided' })

    const apiKey = customKey || process.env.IMGBB_API_KEY
    if (!apiKey) {
      return res.status(400).json({
        error: 'ImgBB API key is missing. Please set IMGBB_API_KEY in .env or provide it in the upload form.'
      })
    }

    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image

    const formData = new FormData()
    formData.append('image', base64Data)

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (!data.success) {
      return res.status(response.status || 400).json({
        error: data.error?.message || 'ImgBB upload failed'
      })
    }

    res.json({
      url: data.data.url,
      display_url: data.data.display_url,
      thumb_url: data.data.thumb?.url,
      delete_url: data.data.delete_url,
      title: data.data.title,
    })
  } catch (err) {
    res.status(500).json({ error: 'Upload failed: ' + err.message })
  }
})

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isMongoConnected ? 'MongoDB Atlas' : 'Local JSON Store',
    mongoConnected: isMongoConnected,
    timestamp: new Date().toISOString(),
  })
})

// ─── Start Server ─────────────────────────────────────────────
async function start() {
  await connectMongo()

  app.listen(PORT, () => {
    console.log('\n🚀 Portfolio API Server')
    console.log(`   Database: ${isMongoConnected ? '🟢 MongoDB Atlas' : '📁 Local JSON Store'}`)
    console.log(`   Running:  http://localhost:${PORT}`)
    console.log(`   Health:   http://localhost:${PORT}/api/health\n`)
  })
}

start()
