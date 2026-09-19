// ============================================================
// PORTFOLIO DATA — Update this file to personalize your portfolio
// ============================================================

export const personalInfo = {
  name: 'Mahathir Mohammad',
  tagline: 'Full Stack Developer & MERN Specialist',
  shortBio:
    "I'm a passionate Full Stack Developer specializing in the MERN stack. I love building scalable, performant web applications with clean code and exceptional user experiences.",
  longBio:
    "With deep expertise in modern web technologies, I craft end-to-end solutions from responsive frontends to robust backends. My focus is on writing clean, maintainable code and delivering products that users love. I'm always exploring new technologies to stay ahead of the curve.",
  location: 'Bangladesh',
  available: true, // Set to false when not open to work
  email: 'your.email@gmail.com', // TODO: Add your email
  phone: '', // TODO: Add your phone (optional)
  resumeLink: '/resume.pdf', // Place your resume in /public/resume.pdf
  profileImage: '/profile.jpg', // Place your photo in /public/profile.jpg
}

export const socialLinks = {
  github: 'https://github.com/yourusername', // TODO: Add your GitHub
  linkedin: 'https://linkedin.com/in/yourprofile', // TODO: Add your LinkedIn
  twitter: '', // TODO: Add your Twitter/X (optional)
  website: '', // TODO: Any other website (optional)
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
      { name: 'React.js', level: 90, icon: '⚛️' },
      { name: 'Next.js', level: 85, icon: '▲' },
      { name: 'TypeScript', level: 82, icon: '🔷' },
      { name: 'JavaScript', level: 92, icon: '🟨' },
      { name: 'Tailwind CSS', level: 88, icon: '🎨' },
      { name: 'HTML / CSS', level: 95, icon: '🌐' },
    ],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    color: 'from-indigo-500 to-purple-500',
    skills: [
      { name: 'Node.js', level: 88, icon: '🟢' },
      { name: 'NestJS', level: 80, icon: '🔴' },
      { name: 'Express.js', level: 88, icon: '🚂' },
      { name: 'REST API', level: 90, icon: '🔌' },
      { name: 'GraphQL', level: 70, icon: '◈' },
      { name: 'WebSocket', level: 72, icon: '⚡' },
    ],
  },
  {
    category: 'Database',
    icon: '🗄️',
    color: 'from-emerald-500 to-teal-500',
    skills: [
      { name: 'MongoDB', level: 88, icon: '🍃' },
      { name: 'MySQL', level: 82, icon: '🐬' },
      { name: 'PostgreSQL', level: 72, icon: '🐘' },
      { name: 'Redis', level: 68, icon: '🔴' },
      { name: 'Mongoose', level: 88, icon: '🍃' },
    ],
  },
  {
    category: 'DevOps & Tools',
    icon: '🛠️',
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Docker', level: 78, icon: '🐳' },
      { name: 'Git & GitHub', level: 92, icon: '🐙' },
      { name: 'Linux', level: 75, icon: '🐧' },
      { name: 'Nginx', level: 68, icon: '🌐' },
      { name: 'AWS (S3, EC2)', level: 65, icon: '☁️' },
      { name: 'CI/CD', level: 70, icon: '🔄' },
    ],
  },
]

// ============================================================
// PROJECTS — Add your projects here
// ============================================================
export const projects = [
  {
    id: 1,
    title: 'Project Name 1',
    description:
      'A powerful full-stack web application built with MERN stack. Features real-time data, authentication, and seamless UX.',
    longDescription:
      'This project was built to solve [specific problem]. Key highlights include JWT authentication, real-time updates with WebSocket, optimized MongoDB queries, and a fully responsive UI.',
    image: '/projects/project1.png', // TODO: Add project screenshot
    tags: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS'],
    category: 'Full Stack',
    liveLink: 'https://project1-demo.com', // TODO: Add live link
    githubLink: 'https://github.com/yourusername/project1', // TODO: Add GitHub repo
    featured: true,
    highlights: [
      'JWT Authentication & Authorization',
      'Real-time updates with WebSocket',
      'RESTful API with Express.js',
      'Responsive design with Tailwind CSS',
    ],
  },
  {
    id: 2,
    title: 'Project Name 2',
    description:
      'A Next.js powered web application with TypeScript, featuring SSR, dynamic routing, and seamless backend integration.',
    longDescription:
      'Built with Next.js 14 and TypeScript, this application leverages server-side rendering for optimal performance and SEO. Integrates with MySQL for data persistence and NestJS for the API layer.',
    image: '/projects/project2.png', // TODO: Add project screenshot
    tags: ['Next.js', 'TypeScript', 'NestJS', 'MySQL', 'Docker'],
    category: 'Full Stack',
    liveLink: 'https://project2-demo.com', // TODO: Add live link
    githubLink: 'https://github.com/yourusername/project2', // TODO: Add GitHub repo
    featured: true,
    highlights: [
      'Server-Side Rendering (SSR)',
      'TypeScript for type safety',
      'NestJS REST API backend',
      'Dockerized deployment',
    ],
  },
  {
    id: 3,
    title: 'Project Name 3',
    description:
      'An e-commerce platform with cart management, payment integration, and an admin dashboard for product management.',
    longDescription:
      'A complete e-commerce solution featuring product catalog, shopping cart, secure checkout with payment gateway, and a full-featured admin panel for managing products, orders, and users.',
    image: '/projects/project3.png', // TODO: Add project screenshot
    tags: ['React.js', 'Node.js', 'MongoDB', 'Redux', 'Stripe'],
    category: 'Full Stack',
    liveLink: 'https://project3-demo.com', // TODO: Add live link
    githubLink: 'https://github.com/yourusername/project3', // TODO: Add GitHub repo
    featured: false,
    highlights: [
      'Product catalog with filtering',
      'Shopping cart with Redux',
      'Stripe payment integration',
      'Admin dashboard & analytics',
    ],
  },
]

export const projectCategories = ['All', 'Full Stack', 'Frontend', 'Backend', 'API']

// ============================================================
// EXPERIENCE & EDUCATION TIMELINE
// ============================================================
export const experiences = [
  {
    type: 'work', // 'work' or 'education'
    title: 'Full Stack Developer', // TODO: Update
    company: 'Company Name', // TODO: Update
    period: '2024 – Present',
    location: 'Bangladesh',
    description:
      'Developed and maintained scalable web applications using MERN stack. Led frontend architecture decisions and contributed to backend API design.',
    highlights: [
      'Built RESTful APIs with Node.js and Express',
      'Implemented React frontend with TypeScript',
      'Optimized MongoDB queries for 40% performance gain',
      'Containerized services using Docker',
    ],
    technologies: ['React.js', 'Node.js', 'MongoDB', 'Docker', 'TypeScript'],
    icon: '💼',
  },
  {
    type: 'education',
    title: 'Bachelor of Science in Computer Science', // TODO: Update
    company: 'University Name', // TODO: Update
    period: '2020 – 2024',
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
