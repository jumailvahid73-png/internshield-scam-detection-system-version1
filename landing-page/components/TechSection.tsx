import { Magnet, Radar, ScanLine, Recycle } from "lucide-react";

const technologies = [
  {
    icon: Magnet,
    title: "Anti-Gravity Lift Arrays",
    description:
      "Modular field emitters neutralize structural mass, letting multi-ton frames rise and reposition without cranes, rigging, or ground impact.",
  },
  {
    icon: Radar,
    title: "Autonomous Salvage Drones",
    description:
      "Swarm-coordinated drones scan, tag, and extract reclaimable material mid-air, sorting metals before a single beam touches the ground.",
  },
  {
    icon: ScanLine,
    title: "AI Structural Mapping",
    description:
      "Real-time stress and material analysis plans the exact deconstruction sequence, minimizing risk and maximizing recoverable yield.",
  },
  {
    icon: Recycle,
    title: "Zero-Debris Reclamation",
    description:
      "Suspended dismantling keeps particulate and debris fallout near zero, containing every fragment for clean, verifiable recovery.",
  },
];

export default function TechSection() {
  return (
    <section id="technology" className="relative border-t border-line bg-silver-light py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-dark">
            Our Technology
          </span>
          <h2 className="mt-3 font-display text-3xl font-700 uppercase tracking-tight text-foreground sm:text-4xl">
            Engineering that defies gravity
          </h2>
          <p className="mt-4 text-muted">
            Every teardown is powered by a proprietary stack built for speed,
            safety, and near-total material recovery.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {technologies.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-xl border border-line bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-silver to-transparent opacity-0 transition-opacity group-hover:opacity-60"
                aria-hidden
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange to-orange-dark text-white shadow-[0_6px_16px_rgba(255,90,31,0.35)]">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 font-display text-base font-700 uppercase tracking-wide text-foreground">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
