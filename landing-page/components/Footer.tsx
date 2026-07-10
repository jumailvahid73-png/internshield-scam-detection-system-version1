import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-silver-dark via-silver to-silver-light font-display text-xs font-800 text-foreground">
                W/S
              </span>
              <span className="font-display text-base font-700">
                WRECK<span className="text-orange">&</span>SALVAGE
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Weightless deconstruction and precision salvage engineering for the
              next generation of industrial sites.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xs font-700 uppercase tracking-widest text-muted">
              Company
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/" className="text-foreground/80 hover:text-orange">Home</Link></li>
              <li><Link href="/about" className="text-foreground/80 hover:text-orange">About Us</Link></li>
              <li><Link href="/#technology" className="text-foreground/80 hover:text-orange">Our Technology</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-700 uppercase tracking-widest text-muted">
              Services
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-foreground/80">
              <li>Anti-Gravity Wrecking</li>
              <li>Precision Salvage</li>
              <li>Structural Deconstruction</li>
              <li>Material Reclamation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-700 uppercase tracking-widest text-muted">
              Get Started
            </h4>
            <p className="mt-4 text-sm text-muted">
              Ready to lift your next teardown off the ground?
            </p>
            <Link
              href="/quote"
              className="mt-4 inline-block rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted md:flex-row">
          <p>&copy; {new Date().getFullYear()} Wreck &amp; Salvage Industrial. All rights reserved.</p>
          <p>Precision Salvage Engineering &mdash; Concept Showcase</p>
        </div>
      </div>
    </footer>
  );
}
