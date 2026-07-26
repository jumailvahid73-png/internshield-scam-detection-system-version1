import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-electric via-cyan to-skyblue shadow-[0_0_12px_rgba(0,191,255,0.7)]"
        style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
      />
    </div>
  )
}
