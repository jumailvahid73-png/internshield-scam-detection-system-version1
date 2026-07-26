import Reveal from '../components/Reveal'
import { clientLogos } from '../data/manifest'
import { clients } from '../data/content'

export default function ClientLogos() {
  const loop = [...clientLogos, ...clientLogos]

  return (
    <section className="relative overflow-hidden border-y border-slate/10 bg-ice py-16">
      <Reveal className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate">
          Trusted by leaders in oil &amp; gas, defense and logistics
        </p>
        <p className="mt-1 text-sm text-slate/70">{clients.join(' · ')}</p>
      </Reveal>

      <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-16 [animation-duration:36s]">
          {loop.map((logo, i) => (
            <img
              key={logo.src + i}
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              className="h-14 w-auto shrink-0 object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
