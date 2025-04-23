import { Container } from '@/components/ui/container'
import { Card, CardContent } from '@/components/ui/card'
import { testimonials } from '@/data/mock-products'
import { useEffect, useRef, useState } from 'react'

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-muted/30">
      <Container>
        <div className="flex flex-col gap-10">
          <div 
            className={`flex flex-col items-center gap-3 text-center transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-3xl font-bold text-foreground">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Read about experiences from our satisfied customers
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={`relative overflow-hidden border border-secondary/10 bg-white shadow-sm hover:shadow-md transition-all duration-500 group transform ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-16 opacity-0'
                }`}
                style={{ 
                  transitionDelay: isVisible ? `${index * 200}ms` : '0ms',
                }}
              >
                <div className="absolute h-1.5 w-full top-0 left-0 bg-accent/40 group-hover:bg-accent transition-colors duration-300"></div>
                <CardContent className="flex flex-col gap-5 p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-offset-2 ring-accent/30 group-hover:ring-accent transition-all duration-300">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <blockquote className="relative text-card-foreground">
                    <span className="absolute -top-2 -left-1 text-4xl text-accent/30 group-hover:text-accent/50 transition-colors duration-300">
                      "
                    </span>
                    <p className="italic pl-5 text-muted-foreground">{testimonial.content}</p>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
