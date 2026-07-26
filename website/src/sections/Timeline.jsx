import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'
import { timeline } from '../data/content'

export default function Timeline() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionLabel
        eyebrow="Our Journey"
        title="Two Decades of Modular Innovation"
        subtitle="From a single Dubai depot to a multi-country engineering network."
      />

      <div className="relative mt-20">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-electric via-cyan/50 to-transparent md:left-1/2 md:-translate-x-1/2" />

        <div className="flex flex-col gap-14">
          {timeline.map((item, i) => (
            <Reveal
              key={item.year}
              direction={i % 2 === 0 ? 'right' : 'left'}
              className={`relative flex flex-col gap-4 pl-12 md:w-1/2 md:pl-0 ${
                i % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:ml-auto md:pl-14'
              }`}
            >
              <span className="absolute left-[10px] top-1 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-electric shadow-glow max-md:block" />
              <span
                className="absolute top-1 hidden h-3 w-3 rounded-full bg-electric shadow-glow md:block"
                style={i % 2 === 0 ? { right: '-7px' } : { left: '-7px' }}
              />
              <div className="glass inline-block rounded-2xl p-6">
                <span className="font-display text-2xl font-bold text-gradient">{item.year}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
