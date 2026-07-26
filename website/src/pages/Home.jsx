import Hero from '../sections/Hero'
import Intro from '../sections/Intro'
import FeaturedSolutions from '../sections/FeaturedSolutions'
import Industries from '../sections/Industries'
import WhyChooseUs from '../sections/WhyChooseUs'
import ProductCategories from '../sections/ProductCategories'
import Stats from '../sections/Stats'
import Timeline from '../sections/Timeline'
import ProjectShowcase from '../sections/ProjectShowcase'
import Testimonials from '../sections/Testimonials'
import ClientLogos from '../sections/ClientLogos'
import LatestNews from '../sections/LatestNews'
import FAQ from '../sections/FAQ'
import CTA from '../sections/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <FeaturedSolutions />
      <Industries />
      <WhyChooseUs />
      <ProductCategories />
      <Stats />
      <Timeline />
      <ProjectShowcase />
      <Testimonials />
      <ClientLogos />
      <LatestNews />
      <FAQ />
      <CTA />
    </>
  )
}
