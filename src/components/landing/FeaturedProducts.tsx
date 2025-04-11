import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ui/product-card'

const featuredProducts = [
  {
    id: '1',
    name: 'Handcrafted Wooden Box',
    price: 49.99,
    image: 'https://picsum.photos/seed/product1/400/400',
    category: 'Home Decor',
  },
  {
    id: '2',
    name: 'Traditional Tea Set',
    price: 89.99,
    image: 'https://picsum.photos/seed/product2/400/400',
    category: 'Kitchen & Dining',
  },
  {
    id: '3',
    name: 'Artisan Wall Art',
    price: 129.99,
    image: 'https://picsum.photos/seed/product3/400/400',
    category: 'Art & Collectibles',
  },
  {
    id: '4',
    name: 'Handwoven Scarf',
    price: 39.99,
    image: 'https://picsum.photos/seed/product4/400/400',
    category: 'Accessories',
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
