import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Globe2, Factory } from 'lucide-react'
import Reveal from '../components/Reveal'
import GlassCard from '../components/GlassCard'
import MagneticButton from '../components/MagneticButton'
import SectionLabel from '../components/SectionLabel'
import { company } from '../data/content'
import { gallery } from '../data/manifest'

const highlights = [
  { icon: Factory, label: 'Manufacturing across 5 facilities' },
  { icon: Globe2, label: 'UAE, India, Oman & global reach' },
  { icon: ShieldCheck, label: 'DNV / ISO certified engineering' },
]

export default function Intro() {
  const img1 = gallery.trading[10]
  const img2 = gallery.modular[3]

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal direction="right">
          <SectionLabel eyebrow="Who We Are" title={company.aboutHeadline} align="left" />
          <p className="mt-6 max-w-xl text-slate leading-relaxed">{company.about}</p>
          <p className="mt-4 max-w-xl text-slate leading-relaxed">{company.aboutExtended}</p>

          <ul className="mt-8 flex flex-col gap-3">
            {highlights.map((h) => (
              <li key={h.label} className="flex items-center gap-3 text-sm font-medium text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-skytint text-electric">
                  <h.icon size={16} />
                </span>
                {h.label}
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <MagneticButton as={Link} to="/about">
              Discover Our Story
              <ArrowRight size={16} />
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal direction="left" className="relative">
          <div className="relative grid grid-cols-2 gap-4">
            <GlassCard className="col-span-2 aspect-[16/10] overflow-hidden p-2">
              <img
                src={img1?.src}
                alt={img1?.alt}
                loading="lazy"
                className="h-full w-full rounded-[16px] object-cover transition duration-700 hover:scale-105"
              />
            </GlassCard>
            <GlassCard className="aspect-square overflow-hidden p-2">
              <img
                src={img2?.src}
                alt={img2?.alt}
                loading="lazy"
                className="h-full w-full rounded-[16px] object-cover transition duration-700 hover:scale-105"
              />
            </GlassCard>
            <GlassCard className="flex aspect-square flex-col items-center justify-center gap-1 text-center">
              <p className="font-display text-4xl font-semibold text-gradient">20+</p>
              <p className="text-xs uppercase tracking-widest text-slate">Years of Trust</p>
            </GlassCard>
          </div>
          <div className="pointer-events-none absolute -z-10 -right-10 -top-10 h-40 w-40 rounded-full bg-electric/20 blur-[80px]" />
        </Reveal>
      </div>
    </section>
  )
}
