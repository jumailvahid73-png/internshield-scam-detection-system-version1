import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-foreground py-20">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #ff5a1f 0%, transparent 45%), radial-gradient(circle at 80% 80%, #c7ccd3 0%, transparent 40%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 text-center lg:flex-row lg:text-left lg:px-8">
        <div>
          <h2 className="font-display text-2xl font-700 uppercase tracking-tight text-white sm:text-3xl">
            Ready for a weightless teardown?
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/70">
            Tell us about your site and we&apos;ll map out a precision salvage
            plan &mdash; no obligation, no dust.
          </p>
        </div>
        <Link
          href="/quote"
          className="group inline-flex shrink-0 items-center gap-2 rounded-md bg-orange px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(255,90,31,0.4)] transition-transform hover:-translate-y-0.5 hover:bg-orange-dark"
        >
          Request a Quote
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
