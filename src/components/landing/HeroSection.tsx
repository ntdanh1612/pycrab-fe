import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[80vh] bg-gradient-to-r/oklch from-primary/10 to-secondary/10">
      <Container className="grid lg:grid-cols-2 gap-8 items-center py-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-display font-bold tracking-tight sm:text-6xl">
            Discover Unique Gifts & Souvenirs
          </h1>
          <p className="text-lg text-muted-foreground">
            Find the perfect gift for every occasion. Handcrafted with love, delivered with care.
          </p>
          <div className="flex gap-4">
            <Button size="lg">Shop Now</Button>
            <Button size="lg" variant="outline">
              View Collections
            </Button>
          </div>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          <Card className="p-2 shadow-lg">
            <img
              src="/placeholder-product-1.jpg"
              alt="Featured Product 1"
              className="aspect-square object-cover rounded-md"
            />
          </Card>
          <Card className="p-2 shadow-lg mt-8">
            <img
              src="/placeholder-product-2.jpg"
              alt="Featured Product 2"
              className="aspect-square object-cover rounded-md"
            />
          </Card>
          <Card className="p-2 shadow-lg">
            <img
              src="/placeholder-product-3.jpg"
              alt="Featured Product 3"
              className="aspect-square object-cover rounded-md"
            />
          </Card>
          <Card className="p-2 shadow-lg mt-8">
            <img
              src="/placeholder-product-4.jpg"
              alt="Featured Product 4"
              className="aspect-square object-cover rounded-md"
            />
          </Card>
        </div>
      </Container>
    </section>
  )
} 