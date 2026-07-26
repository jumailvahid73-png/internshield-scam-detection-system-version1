import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle, MousePointer2 } from 'lucide-react'
import MagneticButton from '../components/MagneticButton'

const HeroScene = lazy(() => import('../three/HeroScene'))

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-white">
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

      {/* 3D container scene — anchored to the lower half so it never fights the headline */}
      <div
        className="absolute inset-x-0 bottom-0 h-[56%] min-h-[340px]"
        style={{ maskImage: 'radial-gradient(ellipse 70% 90% at 50% 60%, black 55%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 90% at 50% 60%, black 55%, transparent 100%)' }}
      >
        <Suspense fallback={<div className="h-full w-full" />}>
          <HeroScene className="h-full w-full" />
        </Suspense>
      </div>

      {/* Floating holographic chips */}
      <motion.div
        className="glass pointer-events-none absolute left-[6%] top-[22%] hidden rounded-2xl px-4 py-3 text-left text-xs font-medium text-ink shadow-glow md:block"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-electric">DNV 2.7-1 Certified</p>
        <p className="text-slate">Offshore-grade engineering</p>
      </motion.div>
      <motion.div
        className="glass pointer-events-none absolute right-[7%] bottom-[30%] hidden rounded-2xl px-4 py-3 text-left text-xs font-medium text-ink shadow-glow md:block"
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <p className="text-electric">20+ Years</p>
        <p className="text-slate">Engineering excellence</p>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric"
        >
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-electric" />
          Since 2003 &middot; Dubai, UAE
        </motion.span>

        <h1 className="text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
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
            Smart Container Solutions
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-7 max-w-2xl text-base text-slate sm:text-lg"
        >
          Premium modular container solutions for business, storage, offices, accommodation,
          industrial projects, and custom engineering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ink/50"
      >
        <MousePointer2 size={16} className="animate-float" />
        <span className="text-[11px] uppercase tracking-[0.2em]">Scroll &amp; drag to explore</span>
      </motion.div>
    </section>
  )
}
