const stats = [
  { value: "480+", label: "Structures Deconstructed" },
  { value: "62,000t", label: "Material Reclaimed" },
  { value: "0.02%", label: "Site Debris Fallout" },
  { value: "13", label: "Years in Field Operation" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className="font-display text-3xl font-800 text-gradient-metal sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
