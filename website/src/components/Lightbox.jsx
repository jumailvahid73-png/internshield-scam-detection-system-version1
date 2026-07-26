import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

export default function Lightbox({ images, index, onClose, onNav }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onNav])

  if (index === null) return null
  const img = images[index]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 backdrop-blur-xl p-4 sm:p-10"
        onClick={onClose}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X size={20} />
        </button>
        <button
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation()
            onNav(-1)
          }}
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation()
            onNav(1)
          }}
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
        >
          <ChevronRight size={20} />
        </button>

        <motion.div
          key={img.src}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-full max-w-4xl flex-col items-center"
        >
          <img src={img.src} alt={img.alt} className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl" />
          <p className="mt-4 text-center text-sm text-white/80">{img.alt}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
