import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ChevronDown, ChevronUp, Star, RefreshCw } from 'lucide-react'
import { api } from '../../lib/api'
import { projects as fallbackProjects, projectCategories as fallbackCategories } from '../../data/portfolioData'

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-glow overflow-hidden group flex flex-col"
    >
      {/* Project Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-dark-700 flex-shrink-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.innerHTML = `
              <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#0d1424,#1a2235);gap:12px">
                <div style="font-size:2.5rem">🚀</div>
                <div style="color:#6366f1;font-family:JetBrains Mono,monospace;font-size:0.75rem;opacity:0.7">&lt;${project.title} /&gt;</div>
              </div>
            `
          }}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent opacity-60" />

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-yellow-300"
            style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Star size={10} className="fill-yellow-300" />
            Featured
          </div>
        )}

        {/* Action buttons overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white transition-all"
              style={{ background: 'rgba(99, 102, 241, 0.8)', backdropFilter: 'blur(8px)' }}
              aria-label="Live Demo"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white transition-all"
              style={{ background: 'rgba(30, 30, 50, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
              aria-label="GitHub Repository"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        <span className="tag w-fit mb-3">{project.category || 'Full Stack'}</span>

        {/* Title */}
        <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
            {project.tags.length > 4 && (
              <span className="tag">+{project.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Expand Button */}
        {(project.longDescription || (project.highlights && project.highlights.length > 0)) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-3"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Less details' : 'More details'}
          </button>
        )}

        {/* Expandable highlights */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {project.longDescription && (
                <p className="text-slate-400 text-sm leading-relaxed mb-3">{project.longDescription}</p>
              )}
              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {project.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-indigo-400 mt-0.5 flex-shrink-0">▸</span>
                      {h}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Links */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-white transition-colors group/link"
            >
              <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              Live Demo
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors ml-auto"
            >
              <Github size={14} />
              Source Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const [projectsList, setProjectsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.projects.getAll()
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data)
        } else {
          setProjectsList(fallbackProjects)
        }
      } catch (err) {
        console.warn('Could not fetch projects from API, falling back to local data:', err)
        setProjectsList(fallbackProjects)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Derive categories dynamically from available projects
  const availableCategories = ['All', ...new Set(projectsList.map(p => p.category).filter(Boolean))]

  const filtered = projectsList.filter(
    (p) => activeFilter === 'All' || p.category === activeFilter
  )

  return (
    <section id="projects" className="relative">
      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">What I've built</p>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle mt-3">
            A selection of projects that showcase my skills and problem-solving approach
          </p>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeFilter === cat
                  ? 'bg-indigo-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white border border-white/10 hover:border-indigo-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading projects...</p>
          </div>
        ) : (
          /* Projects Grid */
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project._id || project.id || i} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-5xl mb-4">🔍</p>
            <p>No projects in this category yet.</p>
          </div>
        )}

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-4">Want to see more of my work?</p>
          <a
            href="https://github.com/grontho69"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-flex"
          >
            <Github size={18} />
            View all on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
