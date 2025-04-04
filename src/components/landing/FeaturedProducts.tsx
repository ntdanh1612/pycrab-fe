import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

const featuredProducts = [
  {
    id: 1,
    name: "Handcrafted Wooden Box",
    price: "$49.99",
    image: "/placeholder-product-1.jpg",
    category: "Home Decor",
  },
  {
    id: 2,
    name: "Traditional Tea Set",
    price: "$89.99",
    image: "/placeholder-product-2.jpg",
    category: "Kitchen & Dining",
  },
  {
    id: 3,
    name: "Artisan Wall Art",
    price: "$129.99",
    image: "/placeholder-product-3.jpg",
    category: "Art & Collectibles",
  },
  {
    id: 4,
    name: "Handwoven Scarf",
    price: "$39.99",
    image: "/placeholder-product-4.jpg",
    category: "Accessories",
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
              <Card key={product.id} className="overflow-hidden group">
                <div className="aspect-square relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary">Quick View</Button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <h3 className="font-medium mt-1">{product.name}</h3>
                  <p className="font-bold mt-1">{product.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
} 