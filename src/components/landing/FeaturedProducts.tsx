import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ui/product-card'

const featuredProducts = [
  {
    id: '1',
    name: 'Handcrafted Sea Turtle Figurine',
    price: 54.99,
    image:
      'https://images.pexels.com/photos/1266708/pexels-photo-1266708.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Collectibles',
  },
  {
    id: '2',
    name: 'Hawaiian Island Map Bamboo Cutting Board',
    price: 79.99,
    image:
      'https://images.pexels.com/photos/8251628/pexels-photo-8251628.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Kitchen & Dining',
  },
  {
    id: '3',
    name: 'Blue Ocean Wave Resin Art Wall Hanging',
    price: 39.99,
    image:
      'https://images.pexels.com/photos/8251628/pexels-photo-8251628.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Art & Home Decor',
  },
  {
    id: '4',
    name: 'Hand-Painted Tropical Sunrise Mug',
    price: 24.99,
    image:
      'https://images.pexels.com/photos/1076886/pexels-photo-1076886.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Drinkware',
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-muted/50">
      <Container>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground mt-2">
                Discover our handpicked selection of unique gifts and souvenirs
              </p>
            </div>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
