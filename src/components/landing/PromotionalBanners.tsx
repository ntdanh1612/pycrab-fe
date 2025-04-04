import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

const promotions = [
  {
    id: 1,
    title: "Spring Collection",
    description: "Discover our new spring arrivals with up to 30% off",
    image: "/promo-spring.jpg",
    buttonText: "Shop Now",
    buttonVariant: "default" as const,
  },
  {
    id: 2,
    title: "Gift Cards",
    description: "The perfect gift for any occasion",
    image: "/promo-gift-cards.jpg",
    buttonText: "Buy Now",
    buttonVariant: "secondary" as const,
  },
]

export function PromotionalBanners() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid md:grid-cols-2 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="relative overflow-hidden rounded-lg aspect-[16/9] group"
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r/oklch from-black/60 to-black/20 flex items-center">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{promo.title}</h3>
                  <p className="text-white/90 mb-4 max-w-md">{promo.description}</p>
                  <Button variant={promo.buttonVariant}>{promo.buttonText}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
} 