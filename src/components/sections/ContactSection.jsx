import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { personalInfo, socialLinks } from '../../data/portfolioData'

const contactItems = [
  {
    icon: Mail,
    label: 'Email',
    value: 'your.email@gmail.com',
    href: `mailto:${personalInfo.email}`,
    color: '#6366f1',
    desc: 'Drop me an email anytime',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/yourusername',
    href: socialLinks.github,
    color: '#e2e8f0',
    desc: 'Check out my repositories',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Connect with me',
    href: socialLinks.linkedin,
    color: '#06b6d4',
    desc: 'Let\'s connect professionally',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: personalInfo.location,
    href: null,
    color: '#a855f7',
    desc: 'Based in Bangladesh, open to remote',
  },
]

export default function ContactSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      // Using Netlify Forms (add data-netlify="true" to form in production)
      // For now, simulate a successful submission
      await new Promise((r) => setTimeout(r, 1200))

      // Netlify Forms submission
      const formBody = new URLSearchParams({
        'form-name': 'contact',
        ...formData,
      })

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      })

      if (res.ok || res.status === 200) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        toast.success('Message sent! I\'ll get back to you soon.')
      } else {
        throw new Error('Form submission failed')
      }
    } catch {
      setStatus('error')
      toast.error('Something went wrong. Please try emailing me directly.')
    }

    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section id="contact" className="relative">
      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">Let's talk</p>
          <h2 className="section-title">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle mt-3">
            Have a project in mind? Let's discuss it and build something amazing together.
          </p>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div className="card-glow p-6 mb-6">
              <h3 className="text-xl font-display font-bold text-white mb-2">Ready to collaborate?</h3>
              <p className="text-slate-400 leading-relaxed">
                Whether you have a job opportunity, a project idea, or just want to say hello — my inbox is always open!
                I typically respond within 24 hours.
              </p>
            </div>

            {contactItems.map(({ icon: Icon, label, value, href, color, desc }) => (
              <div key={label}>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                    style={{ border: '1px solid rgba(99,102,241,0.1)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${color}40`
                      e.currentTarget.style.background = `${color}08`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)'
                      e.currentTarget.style.background = ''
                    }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">{desc}</p>
                      <p className="text-white font-medium text-sm">{value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ border: '1px solid rgba(99,102,241,0.1)' }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">{desc}</p>
                      <p className="text-white font-medium text-sm">{value}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit}
              className="card-glow p-6 sm:p-8 space-y-5"
            >
              {/* Netlify hidden field */}
              <input type="hidden" name="form-name" value="contact" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project inquiry / Job opportunity"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  className="input-field resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  {status === 'sending' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle2 size={16} />
                      Message Sent!
                    </>
                  ) : status === 'error' ? (
                    <>
                      <AlertCircle size={16} />
                      Try Again
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
