import Link from "next/link";
import { ShieldCheck, Gauge, Layers } from "lucide-react";

const points = [
  {
    icon: ShieldCheck,
    title: "Safety-First Field Ops",
    description: "Every lift is simulated and stress-tested before crews ever step on site.",
  },
  {
    icon: Gauge,
    title: "Precision at Scale",
    description: "From single-frame extractions to full industrial yard teardowns.",
  },
  {
    icon: Layers,
    title: "Full-Cycle Reclamation",
    description: "Materials are sorted, graded, and routed back into circulation on-site.",
  },
];

export default function AboutTeaser() {
  return (
    <section className="border-t border-line bg-background py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-dark">
            About Us
          </span>
          <h2 className="mt-3 font-display text-3xl font-700 uppercase tracking-tight text-foreground sm:text-4xl">
            Demolition, re-engineered
          </h2>
          <p className="mt-5 text-muted leading-relaxed">
            Wreck &amp; Salvage was founded to remove the noise, dust, and
            waste from industrial deconstruction. Our anti-gravity lift
            platforms and autonomous drones let us dismantle structures with
            surgical control &mdash; recovering more material, disturbing less
            ground, and finishing faster than conventional crews.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-dark hover:text-orange"
          >
            More about our story &rarr;
          </Link>
        </div>

        <div className="grid gap-6">
          {points.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-xl border border-line bg-surface p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-silver-light text-orange-dark">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-display text-sm font-700 uppercase tracking-wide text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
