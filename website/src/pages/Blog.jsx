import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, Clock, ArrowRight, Mail } from 'lucide-react'
import PageHero from '../components/PageHero'
import GlassCard from '../components/GlassCard'
import Reveal, { Stagger, StaggerItem } from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'
import { blogPosts } from '../data/content'
import { gallery } from '../data/manifest'

function thumbFor(post) {
  return gallery[post.image.cat]?.[post.image.idx]
}

const categories = ['All', ...new Set(blogPosts.map((p) => p.category))]

export default function Blog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight)
      setProgress(Math.min(1, Math.max(0, scrolled)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filtered = useMemo(
    () =>
      blogPosts.filter(
        (p) =>
          (category === 'All' || p.category === category) &&
          (p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(query.toLowerCase()))
      ),
    [query, category]
  )

  const featured = blogPosts[0]

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[55] h-[2px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-electric to-cyan"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <PageHero
        eyebrow="Insights & News"
        title="Ideas From the Container Frontier"
        subtitle="Engineering deep-dives, industry standards, and stories from our global project sites."
        image={gallery.dnv[3]?.src}
      />

      {/* Featured article */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <Link to="/blog">
            <GlassCard className="grid grid-cols-1 overflow-hidden lg:grid-cols-2">
              <div className="aspect-[16/10] lg:aspect-auto">
                <img src={thumbFor(featured)?.src} alt={featured.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <span className="w-max rounded-full bg-skytint px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-electric">
                  Featured &middot; {featured.category}
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">{featured.excerpt}</p>
                <div className="mt-6 flex items-center gap-5 text-xs text-slate">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {featured.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {featured.readTime}
                  </span>
                </div>
                <span className="mt-6 inline-flex w-max items-center gap-1 text-sm font-medium text-electric">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </GlassCard>
          </Link>
        </Reveal>
      </section>

      {/* Search + categories */}
      <section className="mx-auto max-w-7xl px-6 pb-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="glass flex w-full max-w-sm items-center gap-3 rounded-full px-5 py-3 sm:w-auto">
            <Search size={16} className="text-electric" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  category === c ? 'bg-gradient-to-r from-electric to-cyan text-white' : 'bg-ice text-slate hover:text-electric'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {filtered.map((post) => (
            <StaggerItem key={post.title}>
              <Link to="/blog">
                <GlassCard className="group h-full overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={thumbFor(post)?.src}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <span className="rounded-full bg-skytint px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-electric">
                      {post.category}
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold leading-snug text-ink">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate">{post.excerpt}</p>
                    <div className="mt-5 flex items-center gap-4 text-xs text-slate">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-slate">No articles match your search.</p>
        )}
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <Reveal direction="scale">
          <div className="glass flex flex-col items-center gap-6 rounded-[28px] p-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">Stay ahead of the industry</h3>
              <p className="mt-2 text-sm text-slate">Get engineering insights and project stories in your inbox, monthly.</p>
            </div>
            <form className="flex w-full max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3 shadow-inner">
                <Mail size={15} className="text-electric" />
                <input type="email" required placeholder="you@company.com" className="w-full bg-transparent text-sm outline-none" />
              </div>
              <MagneticButton type="submit" className="!px-5">
                Join
              </MagneticButton>
            </form>
          </div>
        </Reveal>
      </section>
    </>
  )
}
