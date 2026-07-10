export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-silver-light py-24">
      <div className="absolute inset-0 grid-fade opacity-70" aria-hidden />
      <div
        className="absolute -top-16 right-[10%] h-56 w-56 rounded-full bg-orange/15 blur-3xl animate-float-slow"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-orange-dark">
          {eyebrow}
        </span>
        <h1 className="mt-3 font-display text-4xl font-800 uppercase tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted">{description}</p>
      </div>
    </section>
  );
}
