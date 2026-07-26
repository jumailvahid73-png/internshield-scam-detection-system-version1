import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import Reveal from '../components/Reveal'
import { faqs } from '../data/content'

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section className="relative mx-auto max-w-4xl px-6 py-28">
      <SectionLabel eyebrow="FAQ" title="Frequently Asked Questions" />

      <Reveal className="mt-14 flex flex-col gap-4">
        {faqs.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={item.q} className="glass overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-base font-medium text-ink">{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-skytint text-electric"
                >
                  <Plus size={15} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-slate">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </Reveal>
    </section>
  )
}
