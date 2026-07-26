import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import Reveal from '../components/Reveal'
import GlassCard from '../components/GlassCard'
import { productCategories } from '../data/content'
import { gallery } from '../data/manifest'

const images = [
  gallery.trading[0],
  gallery.trading[1],
  gallery.trading[5],
  gallery.dnv[0],
  gallery.conversion[0],
  gallery.modular[0],
]

export default function ProductCategories() {
  const scroller = useRef(null)

  function scroll(dir) {
    scroller.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <section className="relative py-28">
      <div className="mx-auto flex max-w-7xl items-end justify-between px-6">
        <SectionLabel
          eyebrow="Product Categories"
          title="A Container for Every Purpose"
          subtitle="Browse our core inventory — drag or scroll horizontally to explore."
          align="left"
        />
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:text-electric"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:text-electric"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <Reveal className="mt-14">
        <div
          ref={scroller}
          className="no-scrollbar flex gap-6 overflow-x-auto px-6 pb-4 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {productCategories.map((cat, i) => (
            <GlassCard key={cat.title} className="group w-[300px] shrink-0 snap-start overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={images[i]?.src}
                  alt={images[i]?.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <span className="absolute bottom-3 left-4 font-display text-2xl font-bold text-white/25">
                  0{i + 1}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-base font-semibold text-ink">{cat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{cat.body}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
