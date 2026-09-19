import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { skillCategories } from '../../data/portfolioData'

const categoryColors = {
  'Frontend':      { from: '#3b82f6', to: '#06b6d4', glow: '#3b82f620' },
  'Backend':       { from: '#6366f1', to: '#a855f7', glow: '#6366f120' },
  'Database':      { from: '#10b981', to: '#14b8a6', glow: '#10b98120' },
  'DevOps & Tools':{ from: '#f59e0b', to: '#ef4444', glow: '#f59e0b20' },
}

function SkillBar({ name, level, icon, inView, delay }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors">{name}</span>
        </div>
        <span className="text-slate-500 text-xs font-mono">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="skills" className="relative">
      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">What I work with</p>
          <h2 className="section-title">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <p className="section-subtitle mt-3">
            Technologies I use to build powerful, scalable web applications
          </p>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === null
                ? 'bg-indigo-500 text-white shadow-glow'
                : 'text-slate-400 hover:text-white border border-white/10 hover:border-indigo-500/40'
            }`}
          >
            All
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.category
                  ? 'bg-indigo-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white border border-white/10 hover:border-indigo-500/40'
              }`}
            >
              {cat.icon} {cat.category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {skillCategories
            .filter(cat => !activeCategory || cat.category === activeCategory)
            .map((cat, catIdx) => {
              const colors = categoryColors[cat.category] || { from: '#6366f1', to: '#06b6d4', glow: '#6366f120' }
              return (
                <motion.div
                  key={cat.category}
                  className="card-glow p-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: colors.glow, border: `1px solid ${colors.from}30` }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-display font-bold text-lg">{cat.category}</h3>
                      <div className="h-0.5 w-12 rounded-full mt-1"
                        style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }} />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    {cat.skills.map((skill, skillIdx) => (
                      <SkillBar
                        key={skill.name}
                        {...skill}
                        inView={inView}
                        delay={catIdx * 0.1 + skillIdx * 0.07}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}
        </div>

        {/* Tech Badges (overview) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm mb-5">Quick Overview</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {skillCategories.flatMap(cat => cat.skills).map((skill) => (
              <span key={skill.name} className="skill-badge cursor-default">
                <span>{skill.icon}</span>
                <span>{skill.name}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
