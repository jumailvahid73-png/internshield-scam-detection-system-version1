import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', tilt = true, as = 'div', ...props }) {
  const ref = useRef(null)

  function handleMove(e) {
    if (!tilt || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.setProperty('--rx', `${(-py * 8).toFixed(2)}deg`)
    ref.current.style.setProperty('--ry', `${(px * 8).toFixed(2)}deg`)
    ref.current.style.setProperty('--mx', `${(px * 100 + 50).toFixed(1)}%`)
    ref.current.style.setProperty('--my', `${(py * 100 + 50).toFixed(1)}%`)
  }

  function handleLeave() {
    if (!ref.current) return
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  const Comp = motion[as] || motion.div

  return (
    <Comp
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: 'perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
      className={`glass group relative rounded-[22px] ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(0,191,255,0.16), transparent 60%)',
        }}
      />
      {children}
    </Comp>
  )
}
