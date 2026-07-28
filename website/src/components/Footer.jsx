import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react'
import { Stagger, StaggerItem } from './Reveal'
import { FacebookIcon, InstagramIcon, LinkedinIcon } from './SocialIcons'
import { company, navLinks, services } from '../data/content'
import { logoFooter, gallery } from '../data/manifest'

const socials = [
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
]

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-slate/10 bg-ice">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-electric/10 blur-[120px]" />

      <Stagger className="relative mx-auto max-w-7xl px-6 pt-24 pb-10" stagger={0.1}>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <StaggerItem className="lg:col-span-2">
            <img src={logoFooter} alt="Iron Box — Trade Without Compromise" className="h-auto w-56 object-contain sm:w-64" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate">
              Pioneering modular container solutions from Dubai since {company.founded}. Manufacturing,
              trading, leasing and engineering excellence across the UAE, India and Oman.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full glass text-ink/70 transition hover:-translate-y-1 hover:text-electric hover:shadow-glow"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">Quick Links</h4>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="group flex items-center gap-1 text-sm text-slate transition hover:text-electric">
                    {l.label}
                    <ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">Solutions</h4>
            <ul className="mt-5 space-y-3">
              {services.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link to="/solutions" className="text-sm text-slate transition hover:text-electric">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">Gallery</h4>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {gallery.modular.slice(0, 6).map((img) => (
                <Link
                  key={img.src}
                  to="/gallery"
                  className="aspect-square overflow-hidden rounded-lg bg-slate/10"
                >
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition duration-500 hover:scale-110" loading="lazy" />
                </Link>
              ))}
            </div>
          </StaggerItem>
        </div>

        <StaggerItem className="mt-16 grid grid-cols-1 gap-6 rounded-3xl glass p-8 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-electric" />
            <div>
              <p className="text-sm font-medium text-ink">Head Office</p>
              <p className="text-sm text-slate">Jebel Ali Industrial Area, Dubai, UAE</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 shrink-0 text-electric" />
            <div>
              <p className="text-sm font-medium text-ink">Call Us</p>
              <p className="text-sm text-slate">{company.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 shrink-0 text-electric" />
            <div>
              <p className="text-sm font-medium text-ink">Email</p>
              <p className="text-sm text-slate">{company.email}</p>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate/10 pt-8 text-xs text-slate sm:flex-row">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p>Engineering the future of modular spaces since {company.founded}.</p>
        </StaggerItem>
      </Stagger>
    </footer>
  )
}
