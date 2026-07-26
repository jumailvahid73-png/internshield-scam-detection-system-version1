import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import Reveal from '../components/Reveal'
import Lightbox from '../components/Lightbox'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import { gallery, allGalleryImages } from '../data/manifest'

const categories = [
  { key: 'all', label: 'All Projects' },
  { key: 'modular', label: 'Steel Modular Units' },
  { key: 'conversion', label: 'Container Conversion' },
  { key: 'dnv', label: 'DNV Offshore' },
  { key: 'trading', label: 'Trading & Leasing' },
  { key: 'retail', label: 'Retail Units' },
  { key: 'depot', label: 'Depot Services' },
]

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const images = useMemo(() => {
    const all = allGalleryImages()
    return filter === 'all' ? all : all.filter((img) => img.category === filter)
  }, [filter])

  function navigate(dir) {
    setLightboxIndex((i) => (i + dir + images.length) % images.length)
  }

  return (
    <>
      <PageHero
        eyebrow="Project Gallery"
        title="A Digital Exhibition of Our Craft"
        subtitle="Explore modular builds, offshore units, conversions and depot operations from across our global network."
        image={gallery.modular[0]?.src}
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionLabel eyebrow="Before / After" title="From Raw Steel to Finished Space" />
        <Reveal className="mt-12">
          <BeforeAfterSlider before={gallery.depot[7]} after={gallery.conversion[7]} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="sticky top-20 z-30 -mx-6 mb-12 overflow-x-auto px-6 py-3">
          <div className="glass mx-auto flex w-max gap-1 rounded-full p-1.5">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  filter === cat.key ? 'text-white' : 'text-slate hover:text-electric'
                }`}
              >
                {filter === cat.key && (
                  <motion.span
                    layoutId="gallery-filter"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-electric to-cyan"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:balance]">
          {images.map((img, i) => (
            <motion.button
              layout
              key={img.src}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i % 9) * 0.04 }}
              onClick={() => setLightboxIndex(i)}
              className="group relative mb-5 block w-full overflow-hidden rounded-[20px] text-left"
              style={{ breakInside: 'avoid' }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full object-cover transition duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              <p className="absolute bottom-0 left-0 right-0 translate-y-3 p-4 text-sm font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {img.alt}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </section>

      <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={navigate} />
    </>
  )
}
