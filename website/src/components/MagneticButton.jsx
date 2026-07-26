import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MagneticButton({
  as: Component = 'button',
  children,
  className = '',
  variant = 'primary',
  ...props
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 })

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    x.set(relX * 0.35)
    y.set(relY * 0.35)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-medium text-[15px] transition-shadow duration-300 select-none'

  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-electric to-cyan text-white shadow-[0_8px_30px_rgba(0,191,255,0.35)] hover:shadow-[0_8px_40px_rgba(0,191,255,0.55)]'
      : 'glass text-ink hover:shadow-glow'

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      <Component className={`${base} ${styles} ${className}`} {...props}>
        <span className="relative z-10">{children}</span>
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/25 [mask-image:linear-gradient(90deg,transparent,black,transparent)] transition-transform duration-700 group-hover:translate-x-full" />
      </Component>
    </motion.div>
  )
}
