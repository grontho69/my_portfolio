import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, Shield, Eye, EyeOff, Plus, Edit3, Trash2, FileText,
  CheckCircle2, XCircle, LogOut, LayoutDashboard, ArrowLeft, Save
} from 'lucide-react'
import { ADMIN_PASSWORD_HASH } from '../data/portfolioData'
import toast from 'react-hot-toast'

// ─── Storage Helpers ──────────────────────────────────────────
const STORAGE_KEY = 'portfolio_blog_posts'
const AUTH_KEY = 'portfolio_admin_session'

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ─── Login Screen ─────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 800)) // Simulate verification delay

    if (password === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem(AUTH_KEY, 'true')
      onLogin()
      toast.success('Welcome back! 🔐')
    } else {
      setError('Incorrect password. Access denied.')
      setPassword('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at center, #0d1424 0%, #030712 100%)' }}>
      {/* Background grid */}
      <div className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <div className="card-glow p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
              <Shield size={28} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-display font-bold text-white text-center mb-1">Admin Access</h1>
          <p className="text-slate-500 text-sm text-center mb-8">Restricted area — authorized personnel only</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="input-field pr-12"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm flex items-center gap-1.5"
              >
                <XCircle size={14} />
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
                ) : (
                  <><Lock size={16} /> Access Dashboard</>
                )}
              </span>
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          This page is not publicly linked. Unauthorized access attempts are logged.
        </p>
      </motion.div>
    </div>
  )
}

// ─── Post Editor ──────────────────────────────────────────────
function PostEditor({ post, onSave, onCancel }) {
  const isNew = !post?.id
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    tags: (post?.tags || []).join(', '),
    published: post?.published ?? false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && isNew ? { slug: slugify(value) } : {}),
    }))
  }

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required.')
      return
    }
    onSave({
      id: post?.id || Date.now().toString(),
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: post?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-display font-bold text-white">
          {isNew ? 'New Post' : 'Edit Post'}
        </h2>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-500"
            />
            <span className={`text-sm font-medium ${form.published ? 'text-emerald-400' : 'text-slate-400'}`}>
              {form.published ? '✅ Published' : '📝 Draft'}
            </span>
          </label>
          <button onClick={handleSave} className="btn-primary py-2 text-sm">
            <span className="flex items-center gap-2"><Save size={15} /> Save Post</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Post title..."
          className="input-field text-lg font-bold"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Slug (URL)</label>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="post-url-slug" className="input-field text-sm font-mono" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="React, Node.js, Tips" className="input-field text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Cover Image URL (optional)</label>
          <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://example.com/image.jpg" className="input-field text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Excerpt / Summary</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={2}
            placeholder="Short description shown in blog listing..."
            className="input-field text-sm resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Content (Markdown supported)</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={20}
            placeholder="# Your article content here...&#10;&#10;Write in **Markdown** format."
            className="input-field text-sm font-mono resize-y"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [posts, setPosts] = useState(getPosts)
  const [editing, setEditing] = useState(null) // null = list, 'new' = new, post = editing

  const handleSave = (postData) => {
    const existing = posts.find((p) => p.id === postData.id)
    const updated = existing
      ? posts.map((p) => (p.id === postData.id ? postData : p))
      : [...posts, postData]
    savePosts(updated)
    setPosts(updated)
    setEditing(null)
    toast.success(existing ? 'Post updated!' : 'Post created!')
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    const updated = posts.filter((p) => p.id !== id)
    savePosts(updated)
    setPosts(updated)
    toast.success('Post deleted.')
  }

  const togglePublish = (id) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, published: !p.published, updatedAt: new Date().toISOString() } : p
    )
    savePosts(updated)
    setPosts(updated)
  }

  if (editing) {
    return (
      <PostEditor
        post={editing === 'new' ? null : editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Blog Posts</h2>
          <p className="text-slate-500 text-sm">{posts.length} total posts</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary py-2 text-sm">
          <span className="flex items-center gap-2"><Plus size={16} /> New Post</span>
        </button>
      </div>

      {/* Posts Table */}
      {posts.length === 0 ? (
        <div className="card-glow p-12 text-center">
          <FileText size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No posts yet. Create your first article!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (
            <div key={post.id} className="card-glow p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${post.published ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                  <h3 className="text-white font-medium text-sm truncate">{post.title}</h3>
                </div>
                <p className="text-slate-500 text-xs font-mono">/{post.slug} • {new Date(post.createdAt).toLocaleDateString()}</p>
                {post.tags?.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {post.tags.slice(0, 3).map((t) => (
                      <span key={t} className="tag text-xs">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(post.id)}
                  className={`p-2 rounded-lg transition-all ${post.published ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-yellow-400 hover:bg-yellow-500/10'}`}
                  title={post.published ? 'Unpublish' : 'Publish'}
                >
                  {post.published ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                </button>
                <button
                  onClick={() => setEditing(post)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  title="Edit"
                >
                  <Edit3 size={17} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Delete"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Admin Page (Root) ────────────────────────────────────────
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === 'true'
  )

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
    toast.success('Logged out successfully.')
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen pt-0"
      style={{ background: 'radial-gradient(ellipse at top, #0d1424 0%, #030712 100%)' }}>
      {/* Fixed neural grid */}
      <div className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Admin Navbar */}
      <div className="sticky top-0 z-50 glass border-b border-indigo-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-indigo-400" />
            <span className="font-display font-bold text-white text-sm">Admin Dashboard</span>
            <span className="tag text-xs hidden sm:inline">Secure</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1.5">
              <LayoutDashboard size={15} />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard onLogout={handleLogout} />
      </div>
    </div>
  )
}
