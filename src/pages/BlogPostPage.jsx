import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react'

function getBlogPosts() {
  try {
    return JSON.parse(localStorage.getItem('portfolio_blog_posts') || '[]')
  } catch {
    return []
  }
}

function readingTime(content) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const posts = getBlogPosts()
    const found = posts.find((p) => p.slug === slug && p.published)
    if (found) setPost(found)
    else setNotFound(true)
  }, [slug])

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-6xl mb-4">📄</p>
          <h1 className="text-3xl font-display font-bold text-white mb-3">Post Not Found</h1>
          <p className="text-slate-400 mb-6">This post doesn't exist or hasn't been published yet.</p>
          <Link to="/blog" className="btn-secondary inline-flex">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </motion.div>

        {/* Cover Image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden mb-8 h-64 sm:h-80"
          >
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 tag">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readingTime(post.content || '')} min read
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-indigo max-w-none"
          style={{
            '--tw-prose-body': '#94a3b8',
            '--tw-prose-headings': '#f1f5f9',
            '--tw-prose-links': '#818cf8',
            '--tw-prose-code': '#a5b4fc',
            '--tw-prose-pre-bg': 'rgba(13, 20, 36, 0.9)',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-display font-bold text-white mt-8 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-display font-bold text-slate-100 mt-6 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-display font-bold text-slate-200 mt-4 mb-2">{children}</h3>,
              p: ({ children }) => <p className="text-slate-300 leading-relaxed mb-4">{children}</p>,
              a: ({ href, children }) => (
                <a href={href} className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noreferrer">
                  {children}
                </a>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="px-1.5 py-0.5 rounded text-sm text-indigo-300 font-mono"
                    style={{ background: 'rgba(99,102,241,0.15)' }}>
                    {children}
                  </code>
                ) : (
                  <code className="block p-4 rounded-xl text-sm font-mono text-slate-200 overflow-x-auto mb-4"
                    style={{ background: 'rgba(13,20,36,0.9)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    {children}
                  </code>
                ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-indigo-500 pl-4 my-4 text-slate-400 italic">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => <ul className="list-none space-y-2 mb-4">{children}</ul>,
              li: ({ children }) => (
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-indigo-400 mt-1 flex-shrink-0">▸</span>
                  {children}
                </li>
              ),
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className="rounded-xl w-full my-6" />
              ),
              hr: () => <hr className="border-white/10 my-8" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Link to="/blog" className="btn-secondary text-sm">← All Posts</Link>
          <Link to="/#contact" className="btn-primary text-sm">
            <span>Get in Touch →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
