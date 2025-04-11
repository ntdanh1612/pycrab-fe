import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturedProducts } from '@/components/landing/FeaturedProducts'
import { PromotionalBanners } from '@/components/landing/PromotionalBanners'
import { NewsletterSubscription } from '@/components/landing/NewsletterSubscription'
import { NewArrivals } from '@/components/sections/NewArrivals'
import { BestSellers } from '@/components/sections/BestSellers'
import { Testimonials } from '@/components/sections/Testimonials'

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <NewArrivals />
      <PromotionalBanners />
      <BestSellers />
      <Testimonials />
      <NewsletterSubscription />
    </>
  )
}
