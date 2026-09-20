import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Github, Linkedin, Mail, Twitter, Code2, Heart, ArrowUp } from 'lucide-react'
import { personalInfo, socialLinks } from '../data/portfolioData'

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const year = new Date().getFullYear()

  const handleQuickLink = (id) => {
    if (location.pathname === '/') {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#' + id)
    }
  }

  const socialIcons = [
    { icon: Github, href: socialLinks.github, label: 'GitHub' },
    { icon: Linkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email' },
    ...(socialLinks.twitter ? [{ icon: Twitter, href: socialLinks.twitter, label: 'Twitter' }] : []),
  ]

  return (
    <footer className="relative z-10 border-t border-indigo-500/10">
      {/* Gradient top accent */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(90deg, transparent, #6366f1, #06b6d4, #a855f7, transparent)'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <Link to="/" className="flex items-center gap-2 group cursor-pointer" onClick={scrollToTop}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}>
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-white">
                <span className="gradient-text">{personalInfo.name.split(' ')[0]}</span>
              </span>
            </Link>
            <p className="text-slate-500 text-xs max-w-xs text-center md:text-left">
              Building the future, one line of code at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-sm">
            <button
              type="button"
              onClick={() => handleQuickLink('about')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleQuickLink('projects')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Projects
            </button>
            <Link to="/blog" className="text-slate-400 hover:text-white transition-colors cursor-pointer">Blog</Link>
            <button
              type="button"
              onClick={() => handleQuickLink('contact')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialIcons.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 text-slate-400 hover:text-white"
                style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)'
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.3)'
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.background = ''
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm flex items-center gap-1">
            © {year} {personalInfo.name}. Made with
            <Heart size={12} className="text-red-400 fill-red-400 mx-0.5" />
            in Bangladesh.
          </p>
          <p className="text-slate-600 text-xs">
            Built with React · Tailwind · Framer Motion
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-xl text-white transition-all duration-300 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
        }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  )
}
