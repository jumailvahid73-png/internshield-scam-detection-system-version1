import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import QuoteForm from "@/components/QuoteForm";
import { Clock, MapPin, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Request a Quote | Wreck & Salvage",
  description:
    "Request a quote for anti-gravity wrecking, salvage, or precision lifting services.",
};

const contactPoints = [
  {
    icon: Clock,
    title: "Response Time",
    description: "We reply within 1 business day with a scoped estimate.",
  },
  {
    icon: MapPin,
    title: "Service Area",
    description: "On-site assessments available for industrial yards nationwide.",
  },
  {
    icon: Mail,
    title: "Direct Line",
    description: "quotes@wrecksalvage.example",
  },
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Let's plan your teardown"
        description="Share a few details about your site and project scope. Our engineering team will follow up with a tailored anti-gravity salvage plan."
      />

      <section className="py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <QuoteForm />

          <div className="space-y-6">
            {contactPoints.map(({ icon: Icon, title, description }) => (
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

            <div className="rounded-xl border border-line bg-gradient-to-br from-silver-light to-surface p-5">
              <p className="text-sm leading-relaxed text-muted">
                Every request is reviewed by a structural engineer before a
                quote is issued &mdash; no automated pricing, no surprises on
                site.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
