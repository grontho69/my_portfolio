import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Lock, Eye, EyeOff, LogOut, LayoutDashboard,
  Plus, Edit3, Trash2, FileText, Rocket, Save, ArrowLeft,
  CheckCircle2, XCircle, Tag, Image, ExternalLink, Github,
  Star, ChevronDown, ChevronUp, RefreshCw, AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../lib/api'
import { ADMIN_SECRET_ROUTE } from '../data/portfolioData'

const AUTH_KEY = 'portfolio_admin_token'
function getToken() { return localStorage.getItem(AUTH_KEY) }
function setToken(t) { localStorage.setItem(AUTH_KEY, t) }
function clearToken() { localStorage.removeItem(AUTH_KEY) }

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
    try {
      const { token } = await api.auth.login(password)
      setToken(token)
      onLogin()
      toast.success('স্বাগতম! 🔐')
    } catch (err) {
      setError(err.message || 'Incorrect password')
      setPassword('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at center, #0d1424 0%, #030712 100%)' }}>
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md">
        <div className="card-glow p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
              <Shield size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold text-white text-center mb-1">Admin Access</h1>
          <p className="text-slate-500 text-sm text-center mb-8">Restricted — authorized personnel only</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password" required className="input-field pr-12" autoFocus />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-400 text-sm flex items-center gap-1.5">
                <XCircle size={14} /> {error}
              </motion.p>
            )}
            <button type="submit" disabled={loading || !password} className="btn-primary w-full justify-center disabled:opacity-50">
              <span className="flex items-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
                  : <><Lock size={16} /> Access Dashboard</>}
              </span>
            </button>
          </form>
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">This page is not publicly linked anywhere.</p>
      </motion.div>
    </div>
  )
}

// ─── Post Editor ──────────────────────────────────────────────
function PostEditor({ post, onSave, onCancel }) {
  const isNew = !post?._id
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    tags: (post?.tags || []).join(', '),
    published: post?.published ?? false,
  })
  const [saving, setSaving] = useState(false)

  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && isNew ? { slug: slugify(value) } : {}),
    }))
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required')
    setSaving(true)
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
      const result = isNew ? await api.posts.create(data) : await api.posts.update(post._id, data)
      onSave(result)
      toast.success(isNew ? '✅ Post created!' : '✅ Post updated!')
    } catch (err) {
      toast.error(err.message)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onCancel} className="text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-display font-bold text-white">{isNew ? 'New Blog Post' : 'Edit Post'}</h2>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-indigo-500" />
            <span className={`text-sm font-medium ${form.published ? 'text-emerald-400' : 'text-slate-400'}`}>
              {form.published ? '✅ Published' : '📝 Draft'}
            </span>
          </label>
          <button onClick={handleSave} disabled={saving} className="btn-primary py-2 text-sm disabled:opacity-60">
            <span className="flex items-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
              Save Post
            </span>
          </button>
        </div>
      </div>
      <div className="grid gap-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Post title..." className="input-field text-lg font-bold" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Slug (URL path)</label>
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
          <label className="block text-xs text-slate-500 mb-1">Excerpt / Short Summary</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Short description for blog listing..." className="input-field text-sm resize-none" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Content — Markdown supported</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={18}
            placeholder="# Your article content&#10;&#10;Write in **Markdown** format.&#10;&#10;- List items&#10;- Code blocks&#10;- Links, etc."
            className="input-field text-sm font-mono resize-y" style={{ minHeight: '380px' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Project Editor ───────────────────────────────────────────
function ProjectEditor({ project, onSave, onCancel }) {
  const isNew = !project?._id
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    image: project?.image || '',
    tags: (project?.tags || []).join(', '),
    category: project?.category || 'Full Stack',
    liveLink: project?.liveLink || '',
    githubLink: project?.githubLink || '',
    featured: project?.featured ?? false,
    highlights: (project?.highlights || []).join('\n'),
    published: project?.published ?? true,
  })
  const [saving, setSaving] = useState(false)

  const categories = ['Full Stack', 'Frontend', 'Backend', 'API', 'Mobile']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) return toast.error('Title and description required')
    setSaving(true)
    try {
      const data = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        highlights: form.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      }
      const result = isNew ? await api.projects.create(data) : await api.projects.update(project._id, data)
      onSave(result)
      toast.success(isNew ? '🚀 Project created!' : '🚀 Project updated!')
    } catch (err) {
      toast.error(err.message)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onCancel} className="text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-display font-bold text-white">{isNew ? 'New Project' : 'Edit Project'}</h2>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-yellow-400" />
            <span className="text-sm text-yellow-400">⭐ Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-indigo-500" />
            <span className={`text-sm font-medium ${form.published ? 'text-emerald-400' : 'text-slate-400'}`}>
              {form.published ? '✅ Published' : '👁 Hidden'}
            </span>
          </label>
          <button onClick={handleSave} disabled={saving} className="btn-primary py-2 text-sm disabled:opacity-60">
            <span className="flex items-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
              Save Project
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Project Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="My Awesome Project" className="input-field" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Short Description * (shown on card)</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2}
            placeholder="A brief description of what this project does..." className="input-field text-sm resize-none" />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Detailed Description (shown when expanded)</label>
          <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={3}
            placeholder="Full description with more context, challenges, and solutions..." className="input-field text-sm resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Project Image URL</label>
            <div className="flex gap-2">
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/screenshot.png" className="input-field text-sm flex-1" />
            </div>
            {form.image && (
              <div className="mt-2 h-20 rounded-lg overflow-hidden border border-indigo-500/20">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover"
                  onError={(e) => { e.target.parentElement.style.display = 'none' }} />
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Tech Stack Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="React.js, Node.js, MongoDB, Docker" className="input-field text-sm" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Live Demo URL</label>
            <input name="liveLink" value={form.liveLink} onChange={handleChange} placeholder="https://myproject.com" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">GitHub Repository URL</label>
            <input name="githubLink" value={form.githubLink} onChange={handleChange} placeholder="https://github.com/username/repo" className="input-field text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Key Features / Highlights (one per line)</label>
          <textarea name="highlights" value={form.highlights} onChange={handleChange} rows={4}
            placeholder="JWT Authentication & Authorization&#10;Real-time updates with WebSocket&#10;Responsive UI with Tailwind CSS&#10;Dockerized deployment"
            className="input-field text-sm font-mono resize-none" />
        </div>
      </div>
    </div>
  )
}

// ─── Posts Tab ────────────────────────────────────────────────
function PostsTab() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.posts.getAll(true)
      setPosts(data)
    } catch (err) {
      toast.error('Failed to load posts: ' + err.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = (saved) => { load(); setEditing(null) }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return
    try {
      await api.posts.delete(id)
      toast.success('Post deleted.')
      load()
    } catch (err) { toast.error(err.message) }
  }

  const handleTogglePublish = async (post) => {
    try {
      await api.posts.update(post._id, { ...post, published: !post.published })
      toast.success(post.published ? 'Unpublished.' : 'Published! 🎉')
      load()
    } catch (err) { toast.error(err.message) }
  }

  if (editing) return <PostEditor post={editing === 'new' ? null : editing} onSave={handleSave} onCancel={() => setEditing(null)} />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Blog Posts</h2>
          <p className="text-slate-500 text-sm">{posts.length} total · {posts.filter(p => p.published).length} published</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-xl text-slate-400 hover:text-white border border-white/10 hover:border-indigo-500/30 transition-all">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setEditing('new')} className="btn-primary py-2 text-sm">
            <span className="flex items-center gap-2"><Plus size={16} /> New Post</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="card-glow p-12 text-center">
          <FileText size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">No posts yet. Create your first article!</p>
          <button onClick={() => setEditing('new')} className="btn-primary text-sm">
            <span className="flex items-center gap-2"><Plus size={15} /> Create First Post</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {[...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(post => (
            <div key={post._id} className="card-glow p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${post.published ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                  <h3 className="text-white font-medium text-sm truncate">{post.title}</h3>
                </div>
                <p className="text-slate-500 text-xs font-mono">/{post.slug} · {new Date(post.createdAt).toLocaleDateString()}</p>
                {post.tags?.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {post.tags.slice(0, 3).map(t => <span key={t} className="tag text-xs">{t}</span>)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all" title="Preview">
                  <ExternalLink size={16} />
                </a>
                <button onClick={() => handleTogglePublish(post)}
                  className={`p-2 rounded-lg transition-all ${post.published ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-yellow-400 hover:bg-yellow-500/10'}`}
                  title={post.published ? 'Unpublish' : 'Publish'}>
                  {post.published ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                </button>
                <button onClick={() => setEditing(post)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all" title="Edit">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(post._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Projects Tab ─────────────────────────────────────────────
function ProjectsTab() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.projects.getAll(true)
      setProjects(data)
    } catch (err) {
      toast.error('Failed to load projects: ' + err.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = () => { load(); setEditing(null) }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return
    try {
      await api.projects.delete(id)
      toast.success('Project deleted.')
      load()
    } catch (err) { toast.error(err.message) }
  }

  const handleTogglePublish = async (project) => {
    try {
      await api.projects.update(project._id, { ...project, published: !project.published })
      toast.success(project.published ? 'Project hidden.' : 'Project published! 🚀')
      load()
    } catch (err) { toast.error(err.message) }
  }

  if (editing) return <ProjectEditor project={editing === 'new' ? null : editing} onSave={handleSave} onCancel={() => setEditing(null)} />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Projects</h2>
          <p className="text-slate-500 text-sm">{projects.length} total · {projects.filter(p => p.published !== false).length} visible</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-xl text-slate-400 hover:text-white border border-white/10 hover:border-indigo-500/30 transition-all">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setEditing('new')} className="btn-primary py-2 text-sm">
            <span className="flex items-center gap-2"><Plus size={16} /> New Project</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card-glow p-12 text-center">
          <Rocket size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">No projects yet. Add your first project!</p>
          <button onClick={() => setEditing('new')} className="btn-primary text-sm">
            <span className="flex items-center gap-2"><Plus size={15} /> Add First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map(project => (
            <div key={project._id} className="card-glow p-4 flex flex-col gap-3">
              {project.image && (
                <div className="h-32 rounded-xl overflow-hidden bg-dark-700">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {project.featured && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                  <span className={`w-2 h-2 rounded-full ${project.published !== false ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <h3 className="text-white font-medium text-sm truncate">{project.title}</h3>
                  <span className="tag text-xs ml-auto">{project.category}</span>
                </div>
                <p className="text-slate-500 text-xs line-clamp-2">{project.description}</p>
                {project.tags?.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {project.tags.slice(0, 4).map(t => <span key={t} className="tag text-xs">{t}</span>)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors" title="Live"><ExternalLink size={14} /></a>}
                {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors" title="GitHub"><Github size={14} /></a>}
                <div className="ml-auto flex gap-1">
                  <button onClick={() => handleTogglePublish(project)}
                    className={`p-1.5 rounded-lg transition-all ${project.published !== false ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-red-400 hover:bg-red-500/10'}`}>
                    {project.published !== false ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                  </button>
                  <button onClick={() => setEditing(project)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Admin Page Root ──────────────────────────────────────────
export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(() => !!getToken())
  const [activeTab, setActiveTab] = useState('posts')

  const handleLogout = () => {
    clearToken()
    setIsAuth(false)
    toast.success('Logged out.')
  }

  if (!isAuth) return <AdminLogin onLogin={() => setIsAuth(true)} />

  const tabs = [
    { id: 'posts', label: 'Blog Posts', icon: FileText },
    { id: 'projects', label: 'Projects', icon: Rocket },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, #0d1424 0%, #030712 100%)' }}>
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Admin Navbar */}
      <div className="sticky top-0 z-50 glass border-b border-indigo-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-indigo-400" />
            <span className="font-display font-bold text-white text-sm">Admin Dashboard</span>
            <span className="tag text-xs hidden sm:inline">🔒 Secure</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1.5">
              <LayoutDashboard size={15} /><span className="hidden sm:inline">View Portfolio</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors">
              <LogOut size={15} /><span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-2 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id ? 'bg-indigo-500 text-white shadow-glow' : 'text-slate-400 hover:text-white border border-white/10 hover:border-indigo-500/30'
              }`}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 pb-12">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeTab === 'posts' && <PostsTab />}
              {activeTab === 'projects' && <ProjectsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
