import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative w-full h-[100vh] flex items-center overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 backdrop-blur-sm bg-background/80">
        <div
          className="absolute inset-0 bg-gradient-to-br from-accent/20 via-secondary/10 to-background"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: Math.max(0.2, 1 - scrollY * 0.002),
          }}
        />
        <div
          className="absolute h-56 w-56 rounded-full blur-3xl -top-10 -left-10 animate-pulse bg-accent/30"
          style={{
            animationDuration: '15s',
          }}
        />
        <div
          className="absolute h-64 w-64 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse bg-secondary/30"
          style={{
            animationDuration: '20s',
          }}
        />
        <div
          className="absolute h-48 w-48 rounded-full blur-3xl bottom-20 left-1/4 animate-pulse bg-primary/20"
          style={{
            animationDuration: '18s',
          }}
        />
      </div>

      <Container className="grid lg:grid-cols-2 gap-8 items-center py-12 relative z-10 h-full">
        <div className="space-y-6 backdrop-blur-md p-8 rounded-2xl shadow-lg border bg-card/60 border-accent/30">
          <h1 className="text-4xl font-display font-bold tracking-tight sm:text-6xl text-foreground">
            Discover Unique Gifts & Souvenirs
          </h1>
          <p className="text-lg text-secondary">
            Find the perfect gift for every occasion. Handcrafted with love, delivered with care.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="transition-all hover:-translate-y-1">
              View Collections
            </Button>
          </div>
        </div>

        <div className="relative perspective-distant">
          <div
            className="grid grid-cols-2 gap-6 translate-z-0 transition-all duration-700"
            style={{ transform: `translateY(${scrollY * -0.05}px) rotateY(5deg)` }}
          >
            {/* Product Card 1 */}
            <div className="group" style={{ marginTop: '0px', transformStyle: 'preserve-3d' }}>
              <Card className="p-3 shadow-md overflow-hidden transition-all duration-500 group-hover:shadow-xl bg-card/80 backdrop-blur-md border-primary/20">
                <div
                  className="relative overflow-hidden rounded-md transition-transform duration-500"
                  style={{
                    transform: 'translateZ(0)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      transform: 'translateZ(20px)',
                      transition: 'transform 0.5s ease-out',
                    }}
                  >
                    <img
                      src="https://images.pexels.com/photos/19018935/pexels-photo-19018935/free-photo-of-coconut-scented-candle-in-jar.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Tropical Coconut Scented Candle"
                      className="aspect-square object-cover w-full rounded-md transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-50 rounded-md bg-gradient-to-r from-primary/40 to-transparent" />
                  </div>
                </div>
                <div
                  className="mt-2 font-medium transition-transform duration-500 text-primary"
                  style={{
                    transform: 'translateZ(30px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  Scented Candle
                </div>
              </Card>
            </div>

            {/* Product Card 2 */}
            <div className="group" style={{ marginTop: '40px', transformStyle: 'preserve-3d' }}>
              <Card className="p-3 shadow-md overflow-hidden transition-all duration-500 group-hover:shadow-xl bg-card/80 backdrop-blur-md border-secondary/20">
                <div
                  className="relative overflow-hidden rounded-md transition-transform duration-500"
                  style={{
                    transform: 'translateZ(0)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      transform: 'translateZ(20px)',
                      transition: 'transform 0.5s ease-out',
                    }}
                  >
                    <img
                      src="https://images.pexels.com/photos/6048903/pexels-photo-6048903.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Handcrafted Ceramic Mug Set"
                      className="aspect-square object-cover w-full rounded-md transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-50 rounded-md bg-gradient-to-r from-secondary/40 to-transparent" />
                  </div>
                </div>
                <div
                  className="mt-2 font-medium transition-transform duration-500 text-secondary"
                  style={{
                    transform: 'translateZ(30px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  Ceramic Mugs
                </div>
              </Card>
            </div>

            {/* Product Card 3 */}
            <div className="group" style={{ marginTop: '0px', transformStyle: 'preserve-3d' }}>
              <Card className="p-3 shadow-md overflow-hidden transition-all duration-500 group-hover:shadow-xl bg-card/80 backdrop-blur-md border-accent/20">
                <div
                  className="relative overflow-hidden rounded-md transition-transform duration-500"
                  style={{
                    transform: 'translateZ(0)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      transform: 'translateZ(20px)',
                      transition: 'transform 0.5s ease-out',
                    }}
                  >
                    <img
                      src="https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Eco-Friendly Woven Beach Tote"
                      className="aspect-square object-cover w-full rounded-md transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-50 rounded-md bg-gradient-to-r from-accent/40 to-transparent" />
                  </div>
                </div>
                <div
                  className="mt-2 font-medium transition-transform duration-500 text-accent-foreground"
                  style={{
                    transform: 'translateZ(30px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  Beach Tote
                </div>
              </Card>
            </div>

            {/* Product Card 4 */}
            <div className="group" style={{ marginTop: '40px', transformStyle: 'preserve-3d' }}>
              <Card className="p-3 shadow-md overflow-hidden transition-all duration-500 group-hover:shadow-xl bg-card/80 backdrop-blur-md border-primary/20">
                <div
                  className="relative overflow-hidden rounded-md transition-transform duration-500"
                  style={{
                    transform: 'translateZ(0)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      transform: 'translateZ(20px)',
                      transition: 'transform 0.5s ease-out',
                    }}
                  >
                    <img
                      src="https://images.pexels.com/photos/4846401/pexels-photo-4846401.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Handmade Shell Wind Chimes"
                      className="aspect-square object-cover w-full rounded-md transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-50 rounded-md bg-gradient-to-r from-primary/40 to-transparent" />
                  </div>
                </div>
                <div
                  className="mt-2 font-medium transition-transform duration-500 text-primary"
                  style={{
                    transform: 'translateZ(30px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  Wind Chimes
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
