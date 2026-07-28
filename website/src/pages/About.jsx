import { Target, Eye, Users } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import Reveal, { Stagger, StaggerItem } from '../components/Reveal'
import Timeline from '../sections/Timeline'
import Testimonials from '../sections/Testimonials'
import ClientLogos from '../sections/ClientLogos'
import CTA from '../sections/CTA'
import { company, coreValues } from '../data/content'
import { gallery } from '../data/manifest'

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Iron Box"
        title={company.aboutHeadline}
        subtitle="Two decades of modular engineering, from Dubai to the world."
        image={gallery.modular[8]?.src}
      />

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
          <Reveal direction="right">
            <SectionLabel eyebrow="Our Story" title="Reimagining Containers for Your Needs" align="left" />
            <p className="mt-6 text-slate leading-relaxed">{company.about}</p>
            <p className="mt-4 text-slate leading-relaxed">{company.aboutExtended}</p>
          </Reveal>

          <Reveal direction="left" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <GlassCard className="p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-skytint text-electric">
                <Target size={18} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{company.mission}</p>
            </GlassCard>
            <GlassCard className="p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-skytint text-electric">
                <Eye size={18} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{company.vision}</p>
            </GlassCard>
            <GlassCard className="p-8 sm:col-span-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-skytint text-electric">
                <Users size={18} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">Where We Operate</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {company.locations.map((loc) => (
                  <span key={loc} className="rounded-full bg-ice px-4 py-1.5 text-xs font-medium text-ink">
                    {loc}
                  </span>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ice py-28">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionLabel eyebrow="Core Values" title="What Drives Us Every Day" />
          <Stagger className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {coreValues.map((v, i) => (
              <StaggerItem key={v.title}>
                <GlassCard className="h-full p-7">
                  <span className="font-display text-3xl font-bold text-gradient">0{i + 1}</span>
                  <h3 className="mt-4 font-display text-base font-semibold text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{v.body}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <SectionLabel eyebrow="Our Team" title="The People Behind the Engineering" />
        <Stagger className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3" stagger={0.12}>
          {gallery.team.map((member) => (
            <StaggerItem key={member.src}>
              <GlassCard className="group overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={member.src}
                    alt={member.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <p className="font-display text-sm font-semibold text-ink">{member.alt}</p>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Timeline />
      <Testimonials />
      <ClientLogos />
      <CTA />
    </>
  )
}
