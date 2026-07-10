import type { Metadata } from "next";
import { Target, Compass, HeartHandshake } from "lucide-react";
import PageHero from "@/components/PageHero";
import StatsBar from "@/components/StatsBar";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "About Us | Wreck & Salvage",
  description:
    "Learn how Wreck & Salvage engineers weightless deconstruction and precision material recovery.",
};

const values = [
  {
    icon: Target,
    title: "Precision Over Force",
    description:
      "We replace brute demolition with calculated, field-guided lifts — every structure is mapped before it moves.",
  },
  {
    icon: Compass,
    title: "Engineered Transparency",
    description:
      "Clients see the plan before we start: sequencing, timelines, and material recovery estimates, no surprises.",
  },
  {
    icon: HeartHandshake,
    title: "Site & Crew Safety",
    description:
      "Anti-gravity handling keeps crews out from under suspended loads, cutting on-site risk to near zero.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Built to lift industry off the ground"
        description="Wreck & Salvage was founded by structural engineers and field crews who were done choking on dust. We build anti-gravity systems that make teardown quieter, cleaner, and safer — without slowing the job down."
      />

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-dark">
              Our Story
            </span>
            <h2 className="mt-3 font-display text-3xl font-700 uppercase tracking-tight text-foreground">
              From scrapyards to the sky
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              We started in conventional wrecking, watching good material get
              buried under rubble on every job. The anti-gravity lift program
              began as a side project to protect a single crew from a
              collapsing frame &mdash; it became the core of how we work.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Today our field units combine lift arrays, salvage drones, and
              AI structural mapping to dismantle sites piece by piece,
              suspended and controlled, recovering material that used to be
              scrap.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-silver-light p-10">
            <h3 className="font-display text-sm font-700 uppercase tracking-widest text-muted">
              Mission
            </h3>
            <p className="mt-3 text-lg font-medium leading-relaxed text-foreground">
              Make industrial deconstruction weightless, clean, and fully
              reclaimable &mdash; one structure at a time.
            </p>
            <div className="mt-8 h-px w-full bg-line" />
            <h3 className="mt-8 font-display text-sm font-700 uppercase tracking-widest text-muted">
              Vision
            </h3>
            <p className="mt-3 text-lg font-medium leading-relaxed text-foreground">
              A demolition industry that measures success in tons recovered,
              not tons landfilled.
            </p>
          </div>
        </div>
      </section>

      <StatsBar />

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-dark">
              What Drives Us
            </span>
            <h2 className="mt-3 font-display text-3xl font-700 uppercase tracking-tight text-foreground">
              Our values
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-line bg-surface p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-silver-dark via-silver to-silver-light text-foreground">
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

      <CTABanner />
    </>
  );
}
