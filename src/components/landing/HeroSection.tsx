import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative w-full h-[100vh] flex items-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
        <div 
          className="absolute inset-0 bg-linear-135/oklch from-primary/20 via-secondary/10 to-background"
          style={{ 
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: Math.max(0.2, 1 - scrollY * 0.002)
          }}
        />
        <div 
          className="absolute h-56 w-56 rounded-full bg-primary/20 blur-3xl -top-10 -left-10 animate-pulse"
          style={{ animationDuration: '15s' }}
        />
        <div 
          className="absolute h-64 w-64 rounded-full bg-secondary/20 blur-3xl -bottom-20 -right-20 animate-pulse"
          style={{ animationDuration: '20s' }}
        />
        <div 
          className="absolute h-48 w-48 rounded-full bg-primary/10 blur-3xl bottom-20 left-1/4 animate-pulse"
          style={{ animationDuration: '18s' }}
        />
      </div>

      <Container className="grid lg:grid-cols-2 gap-8 items-center py-12 relative z-10 h-full">
        <div className="space-y-6 bg-background/30 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-primary/5">
          <h1 className="text-4xl font-display font-bold tracking-tight sm:text-6xl">
            Discover Unique Gifts & Souvenirs
          </h1>
          <p className="text-lg text-muted-foreground">
            Find the perfect gift for every occasion. Handcrafted with love, delivered with care.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:-translate-y-1">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 transition-all hover:-translate-y-1">
              View Collections
            </Button>
          </div>
        </div>
        <div className="relative perspective-distant">
          <div 
            className="grid grid-cols-2 gap-6 transform-3d rotate-y-12 hover:rotate-y-0 transition-transform duration-1000"
            style={{ transform: `rotateY(12deg) translateY(${scrollY * -0.05}px)` }}
          >
            <Card className="p-3 shadow-lg transform-3d rotate-x-6 translate-z-8 hover:translate-z-12 transition-transform duration-500 bg-background/70 backdrop-blur-md border-primary/10">
              <div className="absolute inset-0 bg-linear-45/oklch from-primary/10 to-transparent rounded-md opacity-60" />
              <img
                src="https://picsum.photos/seed/gift1/400"
                alt="Handcrafted Ceramic Vase"
                className="aspect-square object-cover rounded-md relative z-10"
              />
              <div className="mt-2 font-medium relative z-10">Ceramic Vase</div>
            </Card>
            <Card className="p-3 shadow-lg mt-8 transform-3d rotate-x-(-6) translate-z-4 hover:translate-z-12 transition-transform duration-500 bg-background/70 backdrop-blur-md border-secondary/10">
              <div className="absolute inset-0 bg-linear-45/oklch from-secondary/10 to-transparent rounded-md opacity-60" />
              <img
                src="https://picsum.photos/seed/gift2/400"
                alt="Traditional Tea Set"
                className="aspect-square object-cover rounded-md relative z-10"
              />
              <div className="mt-2 font-medium relative z-10">Tea Set</div>
            </Card>
            <Card className="p-3 shadow-lg transform-3d rotate-x-(-6) translate-z-4 hover:translate-z-12 transition-transform duration-500 bg-background/70 backdrop-blur-md border-secondary/10">
              <div className="absolute inset-0 bg-linear-45/oklch from-secondary/10 to-transparent rounded-md opacity-60" />
              <img
                src="https://picsum.photos/seed/gift3/400"
                alt="Silk Embroidered Scarf"
                className="aspect-square object-cover rounded-md relative z-10"
              />
              <div className="mt-2 font-medium relative z-10">Silk Scarf</div>
            </Card>
            <Card className="p-3 shadow-lg mt-8 transform-3d rotate-x-6 translate-z-8 hover:translate-z-12 transition-transform duration-500 bg-background/70 backdrop-blur-md border-primary/10">
              <div className="absolute inset-0 bg-linear-45/oklch from-primary/10 to-transparent rounded-md opacity-60" />
              <img
                src="https://picsum.photos/seed/gift4/400"
                alt="Wooden Music Box"
                className="aspect-square object-cover rounded-md relative z-10"
              />
              <div className="mt-2 font-medium relative z-10">Music Box</div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
} 