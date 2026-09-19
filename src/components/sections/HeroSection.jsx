import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Github, Linkedin, Mail, Download, ArrowDown, MapPin, Zap } from 'lucide-react'
import { personalInfo, socialLinks } from '../../data/portfolioData'

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
      })
    }
    const el = heroRef.current
    el?.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => el?.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Decorative corner lines */}
      <div className="absolute top-24 left-8 w-16 h-16 border-l-2 border-t-2 border-indigo-500/30 rounded-tl-lg" />
      <div className="absolute top-24 right-8 w-16 h-16 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-lg" />
      <div className="absolute bottom-16 left-8 w-16 h-16 border-l-2 border-b-2 border-purple-500/30 rounded-bl-lg" />
      <div className="absolute bottom-16 right-8 w-16 h-16 border-r-2 border-b-2 border-indigo-500/30 rounded-br-lg" />

      <div className="section-container flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full">
        {/* Left: Text Content */}
        <motion.div
          className="flex-1 text-center lg:text-left order-2 lg:order-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm"
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-400 font-medium">Available for opportunities</span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.div variants={itemVariants}>
            <p className="text-slate-400 text-sm font-mono mb-2 tracking-widest uppercase">
              &lt; Hello, World! I'm /&gt;
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-2 leading-tight">
              <span className="text-white">Mahathir</span>
              <br />
              <span className="gradient-text">Mohammad</span>
            </h1>
          </motion.div>

          {/* Animated typing role */}
          <motion.div variants={itemVariants} className="text-xl sm:text-2xl text-slate-300 font-medium mb-6 h-10">
            <TypeAnimation
              sequence={[
                'Full Stack Developer',
                2000,
                'MERN Stack Specialist',
                2000,
                'React.js Expert',
                2000,
                'Node.js Developer',
                2000,
                'TypeScript Enthusiast',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-indigo-300"
            />
          </motion.div>

          {/* Bio */}
          <motion.p variants={itemVariants} className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed">
            {personalInfo.shortBio}
          </motion.p>

          {/* Location */}
          <motion.div variants={itemVariants} className="flex items-center gap-1.5 justify-center lg:justify-start text-slate-500 text-sm mb-8">
            <MapPin size={14} className="text-indigo-400" />
            <span>{personalInfo.location}</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
            <a
              href={`mailto:${personalInfo.email}`}
              className="btn-primary"
            >
              <span className="flex items-center gap-2">
                <Zap size={16} />
                Hire Me
              </span>
            </a>
            <a
              href={personalInfo.resumeLink}
              download
              className="btn-secondary"
            >
              <Download size={16} />
              Download CV
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 justify-center lg:justify-start">
            <span className="text-slate-600 text-sm">Find me on:</span>
            {[
              { icon: Github, href: socialLinks.github, label: 'GitHub', color: '#6366f1' },
              { icon: Linkedin, href: socialLinks.linkedin, label: 'LinkedIn', color: '#06b6d4' },
              { icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email', color: '#a855f7' },
            ].map(({ icon: Icon, href, label, color }) => (
              <a
                key={label}
                href={href}
                target={label === 'Email' ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 text-slate-400 hover:text-white"
                style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color + '80'
                  e.currentTarget.style.background = color + '15'
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.boxShadow = `0 0 15px ${color}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'
                  e.currentTarget.style.background = ''
                  e.currentTarget.style.color = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Profile Image */}
        <motion.div
          className="flex-shrink-0 order-1 lg:order-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          style={{ transform: `perspective(1000px) rotateY(${mousePos.x * 0.03}deg) rotateX(${-mousePos.y * 0.03}deg)` }}
        >
          {/* Outer glow ring */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
            {/* Rotating gradient ring */}
            <div
              className="absolute inset-0 rounded-full animate-spin-slow opacity-70"
              style={{
                background: 'conic-gradient(from 0deg, #6366f1, #06b6d4, #a855f7, #6366f1)',
                padding: '3px',
              }}
            >
              <div className="w-full h-full rounded-full bg-dark-800" />
            </div>

            {/* Profile Image Frame */}
            <div
              className="absolute inset-2 rounded-full overflow-hidden bg-dark-700"
              style={{
                border: '2px solid rgba(99, 102, 241, 0.4)',
                boxShadow: '0 0 50px rgba(99, 102, 241, 0.35), inset 0 0 30px rgba(99, 102, 241, 0.1)',
              }}
            >
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                className="w-full h-full object-cover object-[center_15%] transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  // Fallback avatar with initials
                  e.target.style.display = 'none'
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #0d1424, #1a2235)'
                  e.target.parentElement.innerHTML = `
                    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:Syne,sans-serif;font-weight:800;font-size:4rem;background:linear-gradient(135deg,#6366f1,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
                      MM
                    </div>
                  `
                }}
              />
            </div>

            {/* Floating tech badges */}
            {[
              { label: 'React', pos: '-top-4 -right-4', bg: '#61dafb20', border: '#61dafb40' },
              { label: 'Node.js', pos: '-bottom-4 -left-4', bg: '#68a06320', border: '#68a06340' },
              { label: 'MERN', pos: 'top-1/2 -right-10 -translate-y-1/2', bg: '#6366f120', border: '#6366f140' },
            ].map(({ label, pos, bg, border }) => (
              <div
                key={label}
                className={`absolute ${pos} px-3 py-1 rounded-full text-xs font-semibold text-white font-mono animate-float`}
                style={{ background: bg, border: `1px solid ${border}`, backdropFilter: 'blur(8px)' }}
              >
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={18} className="text-indigo-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
