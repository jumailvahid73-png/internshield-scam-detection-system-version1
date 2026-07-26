import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import Reveal from '../components/Reveal'
import { testimonials } from '../data/content'

export default function Testimonials() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000)
    return () => clearInterval(id)
  }, [])

  const t = testimonials[index]

  function go(dir) {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length)
  }

  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-skytint blur-[120px]" />
      <div className="relative mx-auto max-w-4xl px-6">
        <SectionLabel eyebrow="Testimonials" title="Shining Light on Our Excellence" />

        <Reveal className="relative mt-16">
          <Quote className="mx-auto mb-6 text-electric/40" size={40} />
          <div className="glass relative min-h-[260px] rounded-[28px] p-10 text-center sm:p-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center gap-1 text-electric">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-6 text-lg leading-relaxed text-ink sm:text-xl">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-6 font-display font-semibold text-ink">{t.name}</p>
                <p className="text-sm text-slate">{t.role}</p>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-3 text-ink shadow-md transition hover:text-electric sm:flex"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-3 text-ink shadow-md transition hover:text-electric sm:flex"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-electric' : 'w-1.5 bg-slate/30'
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
