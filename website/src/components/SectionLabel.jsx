import Reveal from './Reveal'

export default function SectionLabel({ eyebrow, title, subtitle, align = 'center' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <Reveal className={`flex max-w-2xl flex-col ${alignment}`}>
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/25 bg-skytint px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric">
          <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_8px_#00bfff]" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">{subtitle}</p>}
    </Reveal>
  )
}
