// ============================================================
// PORTFOLIO DATA — Update this file to personalize your portfolio
// ============================================================

export const personalInfo = {
  name: 'Mahathir Mohammad',
  tagline: 'Full Stack Developer & MERN Specialist',
  shortBio:
    "I'm a passionate Full Stack Developer specializing in the MERN stack & Next.js. I love building scalable, performant web applications with clean code and exceptional user experiences.",
  longBio:
    "With deep expertise in modern web technologies (React, Next.js, Node.js, NestJS, TypeScript, MongoDB, Docker), I craft end-to-end solutions from responsive frontends to robust backends. My focus is on writing clean, maintainable code and delivering products that users love.",
  location: 'Bangladesh',
  available: true,
  email: 'mahathirm880@gmail.com',
  phone: '',
  resumeLink: '/resume.pdf',
  profileImage: '/profile.jpg',
}

export const socialLinks = {
  github: 'https://github.com/grontho69',
  linkedin: 'https://www.linkedin.com/in/mahathir-mohammad-4073b33b2/',
  twitter: '',
  website: '',
}

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

// ============================================================
// TECH STACK SKILLS
// ============================================================
export const skillCategories = [
  {
    category: 'Frontend',
    icon: '🎨',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React.js', level: 92, icon: '⚛️' },
      { name: 'Next.js', level: 90, icon: '▲' },
      { name: 'TypeScript', level: 85, icon: '🔷' },
      { name: 'JavaScript', level: 95, icon: '🟨' },
      { name: 'Tailwind CSS', level: 92, icon: '🎨' },
      { name: 'Framer Motion', level: 88, icon: '✨' },
    ],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    color: 'from-indigo-500 to-purple-500',
    skills: [
      { name: 'Node.js', level: 90, icon: '🟢' },
      { name: 'NestJS', level: 82, icon: '🔴' },
      { name: 'Express.js', level: 90, icon: '🚂' },
      { name: 'Fastify', level: 80, icon: '⚡' },
      { name: 'REST & GraphQL', level: 88, icon: '🔌' },
      { name: 'WebSockets', level: 82, icon: '💬' },
    ],
  },
  {
    category: 'Database',
    icon: '🗄️',
    color: 'from-emerald-500 to-teal-500',
    skills: [
      { name: 'MongoDB', level: 92, icon: '🍃' },
      { name: 'PostgreSQL', level: 85, icon: '🐘' },
      { name: 'MySQL', level: 82, icon: '🐬' },
      { name: 'Drizzle ORM / Prisma', level: 82, icon: '💎' },
      { name: 'Redis', level: 75, icon: '🔴' },
    ],
  },
  {
    category: 'DevOps & Tools',
    icon: '🛠️',
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Docker', level: 82, icon: '🐳' },
      { name: 'Git & GitHub', level: 92, icon: '🐙' },
      { name: 'Linux', level: 80, icon: '🐧' },
      { name: 'Nginx / CI/CD', level: 75, icon: '🔄' },
      { name: 'Vercel / Netlify', level: 90, icon: '▲' },
    ],
  },
]

// ============================================================
// PROJECTS — Real projects showcasing Mahathir's expertise
// ============================================================
export const projects = [
  {
    id: 1,
    title: 'Volans – E-Commerce Platform',
    description:
      'Full-stack modern clothing & apparel platform built for seamless shopping experiences with sleek micro-interactions.',
    longDescription:
      'Full-stack modern clothing & apparel platform built for seamless shopping experiences with sleek micro-interactions, complete product catalog, dynamic cart, checkout, and admin management.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js 14', 'MongoDB', 'Tailwind CSS', 'GSAP', 'Stripe'],
    category: 'Full Stack',
    liveLink: 'https://e-commerce-eta-kohl-38.vercel.app/',
    githubLink: 'https://github.com/grontho69',
    featured: true,
    highlights: [
      'Dynamic Cart & Checkout with sleek micro-interactions',
      'Comprehensive Admin Management dashboard',
      'Stripe Payment Gateway integration for secure billing',
      'Secure Auth & Session Handling with optimized MongoDB queries',
    ],
  },
  {
    id: 2,
    title: 'EduTec 1.0 – STEM Exam Engine',
    description:
      'High-concurrency online admission exam platform with sub-millisecond ranking algorithms & zero-data-loss architecture.',
    longDescription:
      'High-concurrency competitive admission testing platform with an anti-cheat proctoring engine, sub-millisecond leaderboard calculation, and offline resilience.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js 15', 'React 19', 'TypeScript', 'Fastify 5', 'PostgreSQL', 'Drizzle ORM', 'KaTeX', 'Tailwind CSS'],
    category: 'Full Stack',
    liveLink: 'https://web-theta-jade-69.vercel.app/',
    githubLink: 'https://github.com/grontho69/edu_tec_1.0',
    featured: true,
    highlights: [
      'Offline-resilient exam hall powered by IndexedDB',
      'Anti-cheat automated proctoring engine',
      'Top-K Min-Heap real-time leaderboard computation',
      'Topic Dependency DAG & dynamic KaTeX LaTeX rendering',
    ],
  },
  {
    id: 3,
    title: 'ZENJI (ゼンジ) – Cyberpunk Streetwear',
    description:
      'High-end cyberpunk & anime-inspired apparel store featuring heavyweight textiles (460–520 GSM) and tactical ergonomics.',
    longDescription:
      'Cutting-edge cyberpunk fashion commerce experience with interactive PDP size guide, multi-axis category filters, slide-over cart with free shipping meter, and gamified confetti checkout.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Framer Motion', 'Canvas Confetti'],
    category: 'Frontend',
    liveLink: 'https://zenji-project.vercel.app/',
    githubLink: 'https://github.com/grontho69/zenji-project',
    featured: true,
    highlights: [
      'Multi-axis category & silhouette filter matrix',
      'Dynamic PDP with interactive size guide & visual preview',
      'Framer Motion slide-over cart with free shipping meter',
      'Gamified interactive confetti checkout experience',
    ],
  },
  {
    id: 4,
    title: 'FoodFlow – Restaurant & Delivery Platform',
    description:
      'Production-ready culinary operations & delivery ecosystem featuring dedicated workflows for customers, kitchens, and riders.',
    longDescription:
      'Complete restaurant and on-demand food delivery architecture uniting 4 discrete operational interfaces: Customer ordering, Kitchen Display System (KDS), Logistics Rider Dispatch, and Admin Control.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Mongoose', 'Leaflet Maps'],
    category: 'Full Stack',
    liveLink: 'https://restuarent-website-flax.vercel.app/',
    githubLink: 'https://github.com/grontho69/restuarent-website',
    featured: true,
    highlights: [
      'Multi-portal UI (Customer, Kitchen KDS, Rider Dispatch, Admin)',
      'Interactive Leaflet map live delivery GPS tracking',
      'Hybrid MongoDB datastore with real-time order states',
      'Cutting edge React 19 & Next.js 16 architecture',
    ],
  },
  {
    id: 5,
    title: '🤖 AI Job Search Agent',
    description:
      'An AI-powered job search platform that uses machine learning to match candidates with suitable opportunities.',
    longDescription:
      'Cutting-edge AI job search platform leveraging machine learning algorithms to analyze candidate profiles and match them with relevant job opportunities, enhancing the recruitment process for both candidates and employers.',
    image: '',
    tags: ['Next.js 16', 'Python', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Groq', 'Google Cloud AI'],
    category: 'API & Full Stack',
    liveLink: 'https://job-search-agent-pearl.vercel.app/',
    githubLink: 'https://github.com/grontho69/Job-search-agent',
    featured: true,
    highlights: [
      'Searches LinkedIn for jobs posted in the last 24 hours using your keywords',
      'only processes jobs above your threshold (default 80%)',
      'Logs everything to Google Sheets — job title, company, AI score, rationale, CV link, and job link',
      'Never repeats jobs — tracks applied job IDs so you always get fresh listings',
    ],
  },
]

export const projectCategories = ['All', 'Full Stack', 'Frontend', 'Backend', 'API']

// ============================================================
// EXPERIENCE & EDUCATION TIMELINE
// ============================================================
export const experiences = [

  {
    type: 'education',
    title: 'Diploma in Computer Science & Technology', // TODO: Update
    company: 'Kushtia Polytechnic Institute', // TODO: Update
    period: '2024 – Present',
    location: 'Bangladesh',
    description:
      'Studied core computer science fundamentals including algorithms, data structures, databases, and software engineering principles.',
    highlights: [
      'Specialized in web development and distributed systems',
      'Completed multiple full-stack projects',
      'Active member of programming club',
    ],
    technologies: [],
    icon: '🎓',
  },
]

// ============================================================
// ADMIN CONFIG (Hidden — do not share publicly)
// ============================================================
export const ADMIN_SECRET_ROUTE = '/sys-dashboard-9x7k' // Change this to your secret route
export const ADMIN_PASSWORD_HASH = 'mahathir2024' // TODO: Change to a secure password
