import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Code2, Rocket, Globe, Coffee } from 'lucide-react'
import { personalInfo } from '../../data/portfolioData'

const stats = [
  { icon: Code2, label: 'Projects Built', value: '10+', color: '#6366f1' },
  { icon: Coffee, label: 'Cups of Coffee', value: '∞', color: '#f59e0b' },
  { icon: Rocket, label: 'Technologies', value: '15+', color: '#06b6d4' },
  { icon: Globe, label: 'Always Learning', value: '24/7', color: '#a855f7' },
]

export default function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="about" className="relative">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={itemVariants} className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">
            Get to know me
          </motion.p>
          <motion.h2 variants={itemVariants} className="section-title">
            About <span className="gradient-text">Me</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="w-20 h-1 mx-auto mt-4 rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="card-glow p-6 sm:p-8">
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                Hi, I'm{' '}
                <span className="gradient-text">{personalInfo.name}</span> 👋
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                {personalInfo.longBio}
              </p>
              <p className="text-slate-400 leading-relaxed">
                When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and sharing my knowledge through technical articles and community engagement.
              </p>
            </motion.div>

            {/* Key Highlights */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              {[
                { label: 'Location', value: personalInfo.location, icon: '📍' },
                { label: 'Status', value: 'Open to Work', icon: '✅' },
                { label: 'Specialty', value: 'MERN Stack', icon: '⚛️' },
                { label: 'Focus', value: 'Scalable Apps', icon: '🚀' },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.12)',
                  }}
                >
                  <span className="text-xl">{icon}</span>
                  <p className="text-slate-500 text-xs mt-1">{label}</p>
                  <p className="text-white font-semibold text-sm">{value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Stats & Values */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, label, value, color }) => (
                <motion.div
                  key={label}
                  variants={itemVariants}
                  className="card-glow p-5 text-center group"
                  whileHover={{ scale: 1.03 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <p className="text-3xl font-display font-bold text-white">{value}</p>
                  <p className="text-slate-500 text-xs mt-1">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Values */}
            <motion.div variants={itemVariants} className="card-glow p-6">
              <h4 className="text-lg font-display font-bold text-white mb-4">My Core Values</h4>
              <div className="space-y-3">
                {[
                  { label: 'Clean Code', desc: 'Writing readable, maintainable, and efficient code', pct: 95 },
                  { label: 'Performance First', desc: 'Optimizing for speed and scalability', pct: 90 },
                  { label: 'User Experience', desc: 'Building intuitive and enjoyable interfaces', pct: 88 },
                ].map(({ label, desc, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">{label}</span>
                      <span className="text-indigo-400">{pct}%</span>
                    </div>
                    <p className="text-slate-500 text-xs mb-2">{desc}</p>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.1)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${pct}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
