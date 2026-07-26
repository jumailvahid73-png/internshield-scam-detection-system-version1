import { useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'

export default function BeforeAfterSlider({ before, after }) {
  const [pos, setPos] = useState(50)
  const ref = useRef(null)
  const dragging = useRef(false)

  function update(clientX) {
    const rect = ref.current.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }

  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] w-full select-none overflow-hidden rounded-[24px] shadow-glass"
      onMouseDown={(e) => {
        dragging.current = true
        update(e.clientX)
      }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => update(e.touches[0].clientX)}
      onTouchMove={(e) => update(e.touches[0].clientX)}
    >
      <img src={after.src} alt={after.alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <img
        src={before.src}
        alt={before.alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />

      <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-white">Before</span>
      <span className="absolute right-4 top-4 rounded-full bg-electric/90 px-3 py-1 text-xs font-medium text-white">After</span>

      <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-glow">
          <MoveHorizontal size={16} />
        </div>
      </div>
    </div>
  )
}
