import { Container } from "@/components/ui/container"
import { Card, CardContent } from "@/components/ui/card"
import { testimonials } from "@/data/mock-products"

export function Testimonials() {
  return (
    <section className="py-16">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-muted-foreground">
              Read about experiences from our satisfied customers
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative overflow-hidden">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                    "{testimonial.content}"
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