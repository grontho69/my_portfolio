import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import { experiences } from '../../data/portfolioData'

function TimelineItem({ exp, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const isWork = exp.type === 'work'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-6 pb-12 last:pb-0"
    >
      {/* Left: Icon & Line */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Icon */}
        <div
          className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg"
          style={{
            background: isWork
              ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
              : 'linear-gradient(135deg, #06b6d4, #0284c7)',
            boxShadow: isWork
              ? '0 0 20px rgba(99, 102, 241, 0.4)'
              : '0 0 20px rgba(6, 182, 212, 0.4)',
          }}
        >
          {exp.icon}
        </div>

        {/* Connector line */}
        <div
          className="w-0.5 flex-1 mt-3"
          style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(99,102,241,0.05))' }}
        />
      </div>

      {/* Right: Content */}
      <div className="flex-1 pb-2">
        <div className="card-glow p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-wrap gap-2 items-start justify-between mb-3">
            <div>
              <h3 className="text-white font-display font-bold text-lg leading-tight">{exp.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                {isWork ? (
                  <Briefcase size={13} className="text-indigo-400" />
                ) : (
                  <GraduationCap size={13} className="text-cyan-400" />
                )}
                <span className={`text-sm font-medium ${isWork ? 'text-indigo-300' : 'text-cyan-300'}`}>
                  {exp.company}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500 text-sm">{exp.location}</span>
              </div>
            </div>
            <span
              className="flex-shrink-0 text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: isWork ? 'rgba(99, 102, 241, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                border: isWork ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(6, 182, 212, 0.3)',
                color: isWork ? '#a5b4fc' : '#67e8f9',
              }}
            >
              {exp.period}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-4">{exp.description}</p>

          {/* Highlights */}
          {exp.highlights.length > 0 && (
            <div className="space-y-1.5 mb-4">
              {exp.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-indigo-400 mt-0.5 flex-shrink-0">▸</span>
                  {h}
                </div>
              ))}
            </div>
          )}

          {/* Tech Tags */}
          {exp.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
              {exp.technologies.map((tech) => (
                <span key={tech} className="tag">{tech}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function ExperienceSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="experience" className="relative">
      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">My Journey</p>
          <h2 className="section-title">
            Experience & <span className="gradient-text">Education</span>
          </h2>
          <p className="section-subtitle mt-3">
            My professional path and academic background
          </p>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, i) => (
            <TimelineItem key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
