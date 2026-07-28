import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import { Stagger, StaggerItem } from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'
import FAQ from '../sections/FAQ'
import CTA from '../sections/CTA'
import { services, additionalServices } from '../data/content'
import { gallery } from '../data/manifest'

export default function Solutions() {
  const [active, setActive] = useState(services[0].slug)
  const current = services.find((s) => s.slug === active)
  const currentImg = gallery[current.category]?.[2] || gallery[current.category]?.[0]

  return (
    <>
      <PageHero
        eyebrow="Our Solutions"
        title="Engineered Container Systems, Built to Perform"
        subtitle="Manufacturing, trading, leasing, depot services and offshore-certified engineering under one roof."
        image={gallery.dnv[7]?.src}
      />

      {/* Interactive service explorer */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <SectionLabel eyebrow="Explore" title="Six Solutions, One Trusted Partner" />

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {services.map((s) => (
              <button
                key={s.slug}
                onClick={() => setActive(s.slug)}
                className={`relative shrink-0 rounded-2xl px-5 py-4 text-left text-sm font-medium transition-all duration-300 lg:w-full ${
                  active === s.slug ? 'glass text-electric shadow-glow' : 'text-slate hover:bg-ice'
                }`}
              >
                {s.title}
                {active === s.slug && (
                  <motion.span
                    layoutId="service-indicator"
                    className="absolute left-0 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-full bg-electric lg:block"
                  />
                )}
              </button>
            ))}
          </div>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="grid grid-cols-1 gap-0 overflow-hidden lg:grid-cols-2">
              <div className="aspect-[4/3] lg:aspect-auto">
                <img src={currentImg?.src} alt={currentImg?.alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <h3 className="font-display text-2xl font-semibold text-ink">{current.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate">{current.body}</p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {current.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-ink">
                      <Check size={15} className="mt-0.5 shrink-0 text-electric" />
                      {p}
                    </li>
                  ))}
                </ul>
                <MagneticButton as="a" href="/contact" className="mt-8 self-start">
                  Request a Quote <ArrowRight size={15} />
                </MagneticButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Additional services */}
      <section className="relative overflow-hidden bg-ice py-28">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionLabel eyebrow="Also Available" title="Supporting Services" />
          <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2" stagger={0.12}>
            {additionalServices.map((s) => (
              <StaggerItem key={s.title}>
                <GlassCard className="h-full p-8">
                  <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{s.body}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* All solutions grid */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <SectionLabel eyebrow="Full Catalog" title="Every Solution at a Glance" />
        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {services.map((s) => {
            const img = gallery[s.category]?.[1]
            return (
              <StaggerItem key={s.slug}>
                <GlassCard className="group h-full overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={img?.src}
                      alt={img?.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-base font-semibold text-ink">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate">{s.short}</p>
                    <button
                      onClick={() => {
                        setActive(s.slug)
                        window.scrollTo({ top: 400, behavior: 'smooth' })
                      }}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-electric transition hover:gap-2"
                    >
                      View details <ArrowRight size={14} />
                    </button>
                  </div>
                </GlassCard>
              </StaggerItem>
            )
          })}
        </Stagger>
      </section>

      <FAQ />
      <CTA />
    </>
  )
}
