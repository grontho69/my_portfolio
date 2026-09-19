import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {/* 404 */}
        <div className="relative mb-8">
          <p className="text-[8rem] sm:text-[10rem] font-display font-bold leading-none"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(6,182,212,0.3))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-6xl">🚀</p>
          </div>
        </div>

        <h1 className="text-3xl font-display font-bold text-white mb-3">Lost in Space</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved to another dimension.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <span className="flex items-center gap-2">
              <Home size={16} />
              Go Home
            </span>
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        {/* Floating dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: Math.random() * 6 + 3 + 'px',
              height: Math.random() * 6 + 3 + 'px',
              background: i % 2 === 0 ? '#6366f1' : '#06b6d4',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
