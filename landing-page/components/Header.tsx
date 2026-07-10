"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#technology", label: "Technology" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-silver-dark via-silver to-silver-light font-display text-sm font-800 text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
            W/S
          </span>
          <span className="font-display text-lg font-700 tracking-wide">
            WRECK<span className="text-orange">&</span>SALVAGE
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-orange ${
                pathname === link.href ? "text-orange" : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="rounded-md bg-orange px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_6px_20px_rgba(255,90,31,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-orange-dark"
          >
            Request a Quote
          </Link>
        </nav>

        <button
          className="flex items-center justify-center rounded-md border border-line p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground/80 hover:text-orange"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="w-fit rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-white"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
