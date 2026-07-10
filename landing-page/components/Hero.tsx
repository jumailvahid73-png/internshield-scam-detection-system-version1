import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const HERO_VIDEO_URL =
  "https://www.image2url.com/r2/default/videos/1783646857376-d125305b-b38a-40b3-a791-f45cbd56f15d.mp4";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-background">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>

      {/* Light scrim so bright industrial footage stays readable and on-brand */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/55 to-white/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-white/40" />
      <div className="absolute inset-0 grid-fade opacity-60" />

      <div
        className="absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-orange/20 blur-3xl animate-float-slow"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-[6%] h-64 w-64 rounded-full bg-silver-dark/25 blur-3xl animate-float-slower"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 py-32 lg:px-8">
        <div className="max-w-3xl">
          <span className="panel-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-dark">
            <Sparkles size={14} className="text-orange" />
            Anti-Gravity Salvage Engineering
          </span>

          <h1 className="mt-6 break-words font-display text-3xl font-800 uppercase leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Weightless
            <br />
            Deconstruction.
            <br />
            <span className="text-gradient-metal">Precision Salvage.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            We lift, dismantle, and reclaim industrial structures with
            zero-gravity precision &mdash; cutting demolition time, debris, and
            risk to near zero.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 rounded-md bg-orange px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(255,90,31,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-orange-dark"
            >
              Request a Quote
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#technology"
              className="rounded-md border border-line bg-white/70 px-7 py-3.5 text-sm font-semibold tracking-wide text-foreground backdrop-blur transition-colors hover:border-orange hover:text-orange-dark"
            >
              Explore Our Technology
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
