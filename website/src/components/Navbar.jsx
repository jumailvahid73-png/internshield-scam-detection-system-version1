import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Menu, X, Sun, Moon, ArrowRight } from 'lucide-react'
import { navLinks } from '../data/content'
import { logoMain } from '../data/manifest'
import MagneticButton from './MagneticButton'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('dark-preview', dark)
  }, [dark])

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav
          className={`glass mt-4 flex w-full max-w-6xl items-center justify-between gap-4 rounded-full px-5 transition-all duration-500 ${
            scrolled ? 'py-2 shadow-glow' : 'py-3.5'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <motion.img
              src={logoMain}
              alt="Container Solutions"
              whileHover={{ scale: 1.06 }}
              className={`w-auto object-contain transition-all duration-500 ${scrolled ? 'h-8' : 'h-10'}`}
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.to} className="relative">
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `group relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-electric' : 'text-ink/80 hover:text-electric'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full bg-skytint"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className="absolute left-4 right-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-electric to-cyan transition-transform duration-300 group-hover:scale-x-100" />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((s) => !s)}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-skytint hover:text-electric"
            >
              <Search size={17} />
            </button>
            <button
              aria-label="Toggle theme"
              onClick={() => setDark((d) => !d)}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-skytint hover:text-electric"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <MagneticButton as={Link} to="/contact" className="hidden md:inline-flex !px-5 !py-2.5 !text-sm">
              Get a Quote
              <ArrowRight size={15} />
            </MagneticButton>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-skytint"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2"
          >
            <div className="glass flex items-center gap-3 rounded-full px-5 py-3">
              <Search size={17} className="text-electric" />
              <input
                autoFocus
                placeholder="Search containers, services, projects…"
                className="w-full bg-transparent text-sm text-ink placeholder:text-slate outline-none"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X size={16} className="text-slate" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] glass-dark backdrop-blur-2xl lg:hidden"
          >
            <div className="flex justify-end p-6">
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <X size={20} />
              </button>
            </div>
            <motion.ul
              className="flex flex-col items-center gap-2 px-8 pt-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.to}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                  className="w-full"
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block w-full rounded-2xl px-6 py-4 text-center text-2xl font-display font-medium ${
                        isActive ? 'text-electric' : 'text-white'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
              <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} className="mt-6">
                <MagneticButton as={Link} to="/contact">
                  Get a Quote
                  <ArrowRight size={15} />
                </MagneticButton>
              </motion.div>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
