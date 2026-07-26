import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function PageHero({ eyebrow, title, subtitle, image, children, height = 'h-[92svh]' }) {
  return (
    <section className={`relative ${height} min-h-[560px] w-full overflow-hidden bg-ink`}>
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover opacity-45" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-white" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {/* Floating light beams */}
      <motion.div
        className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-electric/30 blur-[100px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan/20 blur-[110px]"
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating holographic panels */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md md:block"
          style={{
            width: 90 + i * 20,
            height: 60 + i * 14,
            top: `${20 + i * 22}%`,
            left: i % 2 === 0 ? `${8 + i * 4}%` : undefined,
            right: i % 2 !== 0 ? `${8 + i * 4}%` : undefined,
          }}
          animate={{ y: [0, -18, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        />
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-skyblue"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-9"
          >
            {children}
          </motion.div>
        )}
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  )
}
