import { Link } from 'react-router-dom'
import { ArrowRight, Expand } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionLabel from '../components/SectionLabel'
import Reveal from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'
import { gallery } from '../data/manifest'

const showcase = [
  { ...gallery.modular[9], span: 'lg:col-span-2 lg:row-span-2' },
  { ...gallery.dnv[6] },
  { ...gallery.conversion[15] },
  { ...gallery.retail[8] },
  { ...gallery.trading[8], span: 'lg:col-span-2' },
]

export default function ProjectShowcase() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
        <SectionLabel
          eyebrow="Project Showcase"
          title="Engineering Stories From the Field"
          align="left"
          subtitle="A glimpse into our recent modular builds, offshore units and depot operations."
        />
        <MagneticButton as={Link} to="/gallery" variant="ghost" className="shrink-0">
          View Full Gallery <ArrowRight size={15} />
        </MagneticButton>
      </div>

      <Reveal className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:auto-rows-[220px]">
        {showcase.map((img, i) => (
          <motion.div
            key={img.src + i}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className={`group relative overflow-hidden rounded-[20px] ${img.span || ''}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full min-h-[160px] object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-70 transition group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
              <p className="max-w-[80%] text-xs font-medium leading-snug text-white sm:text-sm">{img.alt}</p>
              <Expand size={15} className="shrink-0 text-white/80 opacity-0 transition group-hover:opacity-100" />
            </div>
          </motion.div>
        ))}
      </Reveal>
    </section>
  )
}
