import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Code2, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { personalInfo, navItems } from '../data/portfolioData'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()

  // Scroll detection for navbar background & active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      if (location.pathname === '/') {
        // Active section tracking only on homepage
        const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact']
        const current = sections.find((section) => {
          const el = document.getElementById(section)
          if (el) {
            const rect = el.getBoundingClientRect()
            return rect.top <= 120 && rect.bottom >= 120
          }
          return false
        })
        if (current) setActiveSection(current)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const handleNavClick = (href) => {
    setIsOpen(false)

    // If already on homepage, smooth scroll directly
    if (location.pathname === '/') {
      if (href === '#home' || href === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (href.startsWith('#')) {
        const id = href.slice(1)
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else {
      // If on another page (e.g. /blog or /blog/:slug)
      if (href === '#home' || href === '/') {
        navigate('/')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (href.startsWith('#')) {
        navigate('/' + href)
      } else {
        navigate(href)
      }
    }
  }

  const isActive = (href) => {
    if (location.pathname === '/') {
      if (href.startsWith('#')) {
        return activeSection === href.slice(1)
      }
      return false
    }
    return location.pathname === href
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3 glass border-b border-indigo-500/10'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
              >
                <Code2 size={18} className="text-white relative z-10" />
              </div>
              <span className="font-display font-bold text-lg text-white hidden sm:block">
                <span className="gradient-text">MM</span>
                <span className="text-slate-400 text-sm font-normal ml-1.5">dev</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                item.href.startsWith('#') ? (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item.href)}
                    className={`nav-link cursor-pointer ${isActive(item.href) ? 'active text-white' : ''}`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`nav-link ${isActive(item.href) ? 'active text-white' : ''}`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href={personalInfo.resumeLink}
                download
                className="hidden md:flex items-center gap-2 btn-secondary py-2 text-sm"
              >
                <Download size={14} />
                Resume
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl glass text-slate-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden"
              style={{
                background: 'rgba(10, 15, 30, 0.98)',
                borderLeft: '1px solid rgba(99, 102, 241, 0.2)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-indigo-500/10">
                <span className="font-display font-bold text-white">
                  <span className="gradient-text">MM</span>
                  <span className="text-slate-400 text-sm font-normal ml-1.5">dev</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl glass text-slate-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="p-5 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    {item.href.startsWith('#') ? (
                      <button
                        type="button"
                        onClick={() => handleNavClick(item.href)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                          isActive(item.href)
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive(item.href)
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div className="absolute bottom-8 left-5 right-5">
                <a
                  href={personalInfo.resumeLink}
                  download
                  className="btn-primary w-full justify-center"
                >
                  <span className="flex items-center gap-2">
                    <Download size={16} />
                    Download Resume
                  </span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
