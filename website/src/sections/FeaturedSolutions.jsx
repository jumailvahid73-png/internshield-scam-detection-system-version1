import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import { Stagger, StaggerItem } from '../components/Reveal'
import { services } from '../data/content'
import { gallery } from '../data/manifest'

export default function FeaturedSolutions() {
  const featured = services.slice(0, 6)

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionLabel
        eyebrow="What We Build"
        title="Featured Solutions"
        subtitle="From bespoke conversions to certified offshore engineering — every solution is precision-built for its environment."
      />

      <Stagger className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
        {featured.map((service) => {
          const img = gallery[service.category]?.[0]
          return (
            <StaggerItem key={service.slug}>
              <GlassCard className="group h-full overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={img?.src}
                    alt={img?.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <Link
                    to="/solutions"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition duration-300 group-hover:opacity-100 group-hover:-translate-y-1"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-ink">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{service.short}</p>
                  <Link
                    to="/solutions"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-electric transition hover:gap-2"
                  >
                    Learn more <ArrowUpRight size={14} />
                  </Link>
                </div>
              </GlassCard>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
