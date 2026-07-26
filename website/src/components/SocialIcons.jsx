export function FacebookIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-8.06h2.7l.4-3.14h-3.1V7.94c0-.91.25-1.53 1.56-1.53h1.66V3.6C15.9 3.53 14.93 3.5 13.8 3.5c-2.36 0-3.98 1.44-3.98 4.08v2.22H7.1v3.14h2.72V21h3.68Z" />
    </svg>
  )
}

export function InstagramIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LinkedinIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6.94 8.5H3.56V20.4h3.38V8.5ZM5.25 3.6a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20.4h-3.37v-5.9c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1v6h-3.37V8.5h3.24v1.63h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.06 2.25 4.06 5.18v6.84Z" />
    </svg>
  )
}
