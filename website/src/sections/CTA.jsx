import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, PhoneCall } from 'lucide-react'
import Reveal from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'

export default function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-28">
      <Reveal direction="scale">
        <div className="relative overflow-hidden rounded-[32px] bg-ink px-8 py-20 text-center sm:px-16">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <motion.div
            className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-electric/30 blur-[110px]"
            animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-skyblue/20 blur-[120px]"
            animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Ready to Build Your Next Modular Project?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Tell us your requirements and our engineering team will get back to you with a tailored
              proposal within 24 hours.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton as={Link} to="/contact">
                Get a Quote <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton as="a" href="tel:+97140000000" variant="ghost" className="!text-white !bg-white/10 hover:!bg-white/15">
                <PhoneCall size={15} /> Call Us Now
              </MagneticButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
