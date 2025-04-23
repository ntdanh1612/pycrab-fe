import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'

const promotions = [
  {
    id: 1,
    title: 'Summer Beach Collection',
    description: 'Discover our exclusive beach-themed gifts and souvenirs',
    image: 'https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=800',
    buttonText: 'Shop Now',
    buttonColor: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  },
  {
    id: 2,
    title: 'Handcrafted Island Art',
    description: 'Unique pieces created by local artisans',
    image: 'https://images.pexels.com/photos/6431796/pexels-photo-6431796.jpeg?auto=compress&cs=tinysrgb&w=800',
    buttonText: 'Explore',
    buttonColor: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  },
]

export function PromotionalBanners() {
  return (
    <section className="py-16 bg-muted/30">
      <Container>
        <div className="grid md:grid-cols-2 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="relative overflow-hidden rounded-lg aspect-[16/9] group border border-secondary/20 shadow-sm transform-3d perspective-distant"
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-r/oklch from-black/60 to-transparent flex items-center transform-3d">
                <div className="p-8 transition-all duration-500 group-hover:translate-x-2">
                  <h3 className="text-2xl font-bold text-white mb-2">{promo.title}</h3>
                  <p className="text-white/90 mb-6 max-w-md">{promo.description}</p>
                  <Button
                    className={`${promo.buttonColor} shadow-md transform transition duration-300 hover:translate-y-[-3px] hover:shadow-lg cursor-pointer`}
                  >
                    {promo.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
