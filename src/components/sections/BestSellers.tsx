import { Container } from '@/components/ui/container'
import { ProductCard } from '@/components/ui/product-card'
import { bestSellers } from '@/data/mock-products'

export function BestSellers() {
  return (
    <section className="py-16 bg-secondary/10">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-3xl font-bold">Best Sellers</h2>
            <p className="text-muted-foreground">Our most popular and loved products</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
