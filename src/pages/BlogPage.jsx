import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, BookOpen, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'

function readingTime(content) {
  const words = (content || '').trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.posts.getAll()
        setPosts(data)
      } catch (err) {
        setError(err.message)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.excerpt || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">My thoughts</p>
          <h1 className="text-5xl font-display font-bold mb-4">
            Blog <span className="gradient-text">Posts</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Articles and insights about web development, tech, and my journey as a developer.
          </p>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
        </motion.div>

        {/* Search */}
        {posts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
            <input type="search" placeholder="Search articles..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input-field max-w-md mx-auto block" />
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Loading posts...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-3">⚠️ {error}</p>
            <p className="text-slate-500 text-sm">Make sure the API server is running.</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <BookOpen size={56} className="text-indigo-500/30 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              {search ? 'No posts found' : 'Coming Soon'}
            </h2>
            <p className="text-slate-400 mb-6">
              {search ? 'Try different search terms.' : "I'm working on some great articles. Stay tuned!"}
            </p>
            <Link to="/" className="btn-secondary inline-flex">← Back to Portfolio</Link>
          </motion.div>
        )}

        {/* Posts */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-6">
            {filtered.map((post, i) => (
              <motion.article key={post._id || post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link to={`/blog/${post.slug}`} className="card-glow p-6 sm:p-7 flex flex-col sm:flex-row gap-6 group block">
                  {post.coverImage && (
                    <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden flex-shrink-0 bg-dark-700">
                      <img src={post.coverImage} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                      </div>
                    )}
                    <h2 className="text-xl font-display font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {readingTime(post.content || post.excerpt || '')} min read
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-indigo-400 group-hover:gap-2 transition-all">
                        Read more <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
