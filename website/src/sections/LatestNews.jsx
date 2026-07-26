import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import GlassCard from '../components/GlassCard'
import { Stagger, StaggerItem } from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'
import { blogPosts } from '../data/content'
import { gallery } from '../data/manifest'

export default function LatestNews() {
  const posts = blogPosts.slice(0, 3)

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
        <SectionLabel eyebrow="Latest News" title="Insights From the Container Industry" align="left" />
        <MagneticButton as={Link} to="/blog" variant="ghost" className="shrink-0">
          Visit Blog <ArrowRight size={15} />
        </MagneticButton>
      </div>

      <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
        {posts.map((post) => (
          <StaggerItem key={post.title}>
            <GlassCard className="group h-full overflow-hidden">
              <Link to="/blog">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={gallery[post.image.cat]?.[post.image.idx]?.src}
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
              </Link>
            </GlassCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
