import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ParticleBackground from '../components/ParticleBackground'

export default function MainLayout() {
  const location = useLocation()

  // Handle hash navigation across different routes (e.g. from /blog -> /#projects)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
      return () => clearTimeout(timer)
    } else if (location.pathname === '/') {
      // If user clicked home or logo from another page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.pathname, location.hash])

  return (
    <div className="relative min-h-screen bg-dark-800 overflow-x-hidden">
      {/* Animated Background */}
      <ParticleBackground />

      {/* Subtle noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
