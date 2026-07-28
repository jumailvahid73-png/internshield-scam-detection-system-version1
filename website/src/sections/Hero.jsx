import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle, MousePointer2 } from 'lucide-react'
import MagneticButton from '../components/MagneticButton'
import { gallery } from '../data/manifest'

const heroImage = gallery.modular[9]

function HeroVisual() {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 120, damping: 16 })
  const sry = useSpring(ry, { stiffness: 120, damping: 16 })

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(px * 10)
    rx.set(-py * 8)
  }

  function handleLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6" style={{ perspective: 1400 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass holo-border relative aspect-[16/8] w-full overflow-hidden rounded-[28px] shadow-glow sm:aspect-[16/7]"
      >
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-electric/10" />
        <div className="absolute inset-0 bg-grid opacity-20 mix-blend-overlay" />

        {/* scan line */}
        <motion.div
          className="absolute inset-x-0 h-24 bg-gradient-to-b from-cyan/0 via-cyan/25 to-cyan/0"
          animate={{ y: ['-10%', '110%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/85 px-4 py-3 text-xs font-medium text-ink shadow-md backdrop-blur">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-electric" />
            Live from our Dubai facility
          </span>
          <span className="hidden text-slate sm:inline">Modular E-House Units</span>
        </div>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-white pt-28 pb-10">
      {/* Digital grid floor / background */}
      <div className="absolute inset-0 bg-gradient-to-b from-skytint via-white to-ice" />
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,black,transparent)]" />

      {/* Ambient glow blobs */}
      <motion.div
        className="pointer-events-none absolute top-10 left-[8%] h-72 w-72 rounded-full bg-electric/20 blur-[110px]"
        animate={{ y: [0, 30, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-10 right-[10%] h-80 w-80 rounded-full bg-skyblue/25 blur-[120px]"
        animate={{ y: [0, -30, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Floating holographic chips */}
      <motion.div
        className="glass pointer-events-none absolute left-[6%] top-[26%] hidden rounded-2xl px-4 py-3 text-left text-xs font-medium text-ink shadow-glow xl:block"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-electric">DNV 2.7-1 Certified</p>
        <p className="text-slate">Offshore-grade engineering</p>
      </motion.div>
      <motion.div
        className="glass pointer-events-none absolute right-[6%] top-[30%] hidden rounded-2xl px-4 py-3 text-left text-xs font-medium text-ink shadow-glow xl:block"
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <p className="text-electric">20+ Years</p>
        <p className="text-slate">Engineering excellence</p>
      </motion.div>

      {/* Text content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric"
        >
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-electric" />
          Since 2003 &middot; Dubai, UAE
        </motion.span>

        <h1 className="text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
          {'Building the Future with'.split(' ').map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-gradient"
          >
            Iron Box
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-5 max-w-2xl text-base text-slate sm:text-lg"
        >
          Premium modular container solutions for business, storage, offices, accommodation,
          industrial projects, and custom engineering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton as={Link} to="/contact">
            Get a Quote
            <ArrowRight size={16} />
          </MagneticButton>
          <MagneticButton as={Link} to="/solutions" variant="ghost">
            <PlayCircle size={17} />
            Explore Solutions
          </MagneticButton>
        </motion.div>
      </div>

      {/* Featured facility visual — sits below the text in normal flow, never overlapping it */}
      <div className="relative z-10 mt-10 flex flex-1 items-center sm:mt-12">
        <HeroVisual />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="relative z-10 mx-auto mt-8 flex flex-col items-center gap-2 text-ink/50"
      >
        <MousePointer2 size={16} className="animate-float" />
        <span className="text-[11px] uppercase tracking-[0.2em]">Scroll to explore</span>
      </motion.div>
    </section>
  )
}
