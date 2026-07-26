import Reveal, { Stagger, StaggerItem } from '../components/Reveal'
import Counter from '../components/Counter'
import { stats } from '../data/content'

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-skyblue">
            By The Numbers
          </span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Numbers That Speak for Themselves</h2>
        </Reveal>

        <Stagger className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4" stagger={0.1}>
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <p className="font-display text-4xl font-bold text-gradient sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-xs uppercase tracking-widest text-white/60 sm:text-sm">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
