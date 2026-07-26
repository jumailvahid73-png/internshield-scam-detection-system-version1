import { motion } from 'framer-motion'

const variants = {
  up: { hidden: { opacity: 0, y: 48, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  down: { hidden: { opacity: 0, y: -48, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  left: { hidden: { opacity: 0, x: 48, filter: 'blur(8px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)' } },
  right: { hidden: { opacity: 0, x: -48, filter: 'blur(8px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)' } },
  scale: { hidden: { opacity: 0, scale: 0.85, filter: 'blur(8px)' }, visible: { opacity: 1, scale: 1, filter: 'blur(0px)' } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  once = true,
  amount = 0.25,
  className = '',
  as = 'div',
}) {
  const Comp = motion[as] || motion.div
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants[direction] || variants.up}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  )
}

export function Stagger({ children, className = '', stagger = 0.12, once = true, amount = 0.2 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', direction = 'up' }) {
  return (
    <motion.div className={className} variants={variants[direction] || variants.up} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}
