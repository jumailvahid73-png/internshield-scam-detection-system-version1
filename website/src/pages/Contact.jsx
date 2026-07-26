import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Navigation,
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '../components/SocialIcons'
import PageHero from '../components/PageHero'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import Reveal, { Stagger, StaggerItem } from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'
import FAQ from '../sections/FAQ'
import { company } from '../data/content'
import { gallery } from '../data/manifest'

const offices = [
  { city: 'Dubai, UAE (HQ)', address: 'Jebel Ali Industrial Area, Dubai', phone: '+971 4 000 0000' },
  { city: 'Mundra, India', address: 'Mundra Industrial Zone, Gujarat', phone: '+91 00 0000 0000' },
  { city: 'Sohar, Oman', address: 'Sohar Industrial Estate, Oman', phone: '+968 0 000 0000' },
]

const hours = [
  { day: 'Sunday – Thursday', time: '8:00 AM – 6:00 PM' },
  { day: 'Friday', time: 'Closed' },
  { day: 'Saturday', time: '9:00 AM – 2:00 PM' },
]

const socials = [
  { icon: InstagramIcon, label: 'Instagram' },
  { icon: LinkedinIcon, label: 'LinkedIn' },
  { icon: FacebookIcon, label: 'Facebook' },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Let's Engineer Your Next Project"
        subtitle="Reach out for a tailored quote, technical consultation, or to visit one of our facilities."
        image={gallery.trading[14]?.src}
        height="h-[70svh]"
      />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_1fr]">
          {/* Form */}
          <Reveal direction="right">
            <GlassCard className="p-8 sm:p-10">
              <h2 className="font-display text-2xl font-semibold text-ink">Request a Quote</h2>
              <p className="mt-2 text-sm text-slate">Fill in your details and our team will respond within 24 hours.</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-10 flex flex-col items-center gap-3 py-10 text-center"
                >
                  <CheckCircle2 size={48} className="text-electric" />
                  <p className="font-display text-lg font-semibold text-ink">Message sent successfully</p>
                  <p className="max-w-xs text-sm text-slate">
                    Thank you for reaching out. Our engineering team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-sm font-medium text-electric hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Full Name" name="name" placeholder="John Doe" />
                  <FormField label="Email Address" name="email" type="email" placeholder="john@company.com" />
                  <FormField label="Phone Number" name="phone" placeholder="+971 5X XXX XXXX" />
                  <FormField label="Company" name="company" placeholder="Your company" />
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate">
                      Solution of Interest
                    </label>
                    <select className="w-full rounded-xl border border-slate/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-electric">
                      <option>Container Conversion</option>
                      <option>Container Trading</option>
                      <option>DNV Offshore Containers</option>
                      <option>Modular Steel Buildings</option>
                      <option>Container Leasing</option>
                      <option>Depot Services</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate">
                      Project Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your project…"
                      className="w-full resize-none rounded-xl border border-slate/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-electric"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <MagneticButton type="submit" className="w-full sm:w-auto" disabled={loading}>
                      {loading ? 'Sending…' : 'Send Message'}
                      <Send size={15} />
                    </MagneticButton>
                  </div>
                </form>
              )}
            </GlassCard>
          </Reveal>

          {/* Info + map */}
          <Reveal direction="left" className="flex flex-col gap-6">
            <GlassCard className="relative aspect-[4/3] overflow-hidden p-0">
              <div className="absolute inset-0 bg-gradient-to-br from-skytint via-white to-ice" />
              <div className="absolute inset-0 bg-grid opacity-50" />
              <motion.div
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-electric"
                animate={{ scale: [1, 6], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-skyblue"
                  style={{ left: `${30 + i * 20}%`, top: `${35 + i * 15}%` }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3 + i, repeat: Infinity }}
                />
              ))}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white/90 px-4 py-3 text-xs font-medium text-ink shadow-md">
                <span className="flex items-center gap-2">
                  <Navigation size={13} className="text-electric" /> Jebel Ali, Dubai
                </span>
                <span className="text-slate">Head Office</span>
              </div>
            </GlassCard>

            <GlassCard className="p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-skytint text-electric">
                  <Clock size={16} />
                </span>
                <h3 className="font-display text-base font-semibold text-ink">Business Hours</h3>
              </div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {hours.map((h) => (
                  <li key={h.day} className="flex justify-between text-sm text-slate">
                    <span>{h.day}</span>
                    <span className="font-medium text-ink">{h.time}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-skytint text-electric">
                  <Mail size={16} />
                </span>
                <h3 className="font-display text-base font-semibold text-ink">Connect With Us</h3>
              </div>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate">
                <span className="flex items-center gap-2">
                  <Phone size={13} className="text-electric" /> {company.phone}
                </span>
                <span className="flex items-center gap-2">
                  <Mail size={13} className="text-electric" /> {company.email}
                </span>
              </div>
              <div className="mt-5 flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-ice text-ink/70 transition hover:-translate-y-1 hover:text-electric"
                  >
                    <s.icon size={15} />
                  </a>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* Offices */}
      <section className="relative overflow-hidden bg-ice py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionLabel eyebrow="Our Offices" title="Find Us Across the Region" />
          <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3" stagger={0.12}>
            {offices.map((o) => (
              <StaggerItem key={o.city}>
                <GlassCard className="h-full p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-skytint text-electric">
                    <MapPin size={17} />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold text-ink">{o.city}</h3>
                  <p className="mt-2 text-sm text-slate">{o.address}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-ink">
                    <Phone size={13} className="text-electric" /> {o.phone}
                  </p>
                </GlassCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <FAQ />
    </>
  )
}

function FormField({ label, name, type = 'text', placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-electric"
      />
    </div>
  )
}
