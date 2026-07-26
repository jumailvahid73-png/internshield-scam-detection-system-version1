import { motion } from 'framer-motion'
import { Network, Boxes, Award, BadgeCheck } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import Reveal, { Stagger, StaggerItem } from '../components/Reveal'
import { whyChooseUs } from '../data/content'

const icons = [Network, Boxes, Award, BadgeCheck]

export default function WhyChooseUs() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
        <Reveal direction="right">
          <SectionLabel eyebrow="Why Choose Us" title="Engineering Excellence, Delivered Reliably" align="left" />
          <p className="mt-6 max-w-lg text-slate leading-relaxed">
            Two decades of collaboration with multinational corporations, backed by the largest inventory
            of new and used ISO containers in the region.
          </p>

          <div className="relative mt-10 aspect-[4/3] w-full max-w-md overflow-hidden rounded-[24px]">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-electric via-cyan to-skyblue opacity-90"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '200% 200%' }}
            />
            <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
            <div className="relative flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-white">
              <p className="font-display text-5xl font-bold">100%</p>
              <p className="text-sm uppercase tracking-widest text-white/80">Quality Assured Fleet</p>
            </div>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2" stagger={0.1}>
          {whyChooseUs.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <StaggerItem key={item.title}>
                <div className="glass group h-full rounded-[22px] p-7 transition duration-500 hover:-translate-y-2 hover:shadow-glow">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-skytint text-electric transition duration-500 group-hover:bg-electric group-hover:text-white">
                    <Icon size={18} />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{item.body}</p>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
