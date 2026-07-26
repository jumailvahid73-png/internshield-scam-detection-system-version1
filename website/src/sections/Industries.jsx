import { Fuel, HardHat, Store, Shield, Ship, HeartPulse } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import { Stagger, StaggerItem } from '../components/Reveal'
import { industries } from '../data/content'

const icons = [Fuel, HardHat, Store, Shield, Ship, HeartPulse]

export default function Industries() {
  return (
    <section className="relative overflow-hidden bg-ice py-28">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionLabel
          eyebrow="Industries We Serve"
          title="Trusted Across Every Sector"
          subtitle="From offshore oil platforms to defense training grounds, our modular engineering adapts to any mission."
        />

        <Stagger className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {industries.map((ind, i) => {
            const Icon = icons[i % icons.length]
            return (
              <StaggerItem key={ind.title}>
                <GlassCard className="group flex h-full flex-col gap-4 p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-electric to-cyan text-white shadow-glow transition duration-500 group-hover:rotate-6">
                    <Icon size={20} />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ink">{ind.title}</h3>
                  <p className="text-sm leading-relaxed text-slate">{ind.body}</p>
                </GlassCard>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
