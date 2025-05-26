import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function NewsletterSubscription() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    console.log('Subscribe:', email)
  }

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Stay Updated</h2>
            <p className="text-primary-foreground/90">
              Subscribe to our newsletter for exclusive offers, new arrivals, and inspiring gift
              ideas.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              required
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
          <p className="text-sm text-primary-foreground/80">
            By subscribing, you agree to receive marketing emails from us. You can unsubscribe at
            any time.
          </p>
        </div>
      </Container>
    </section>
  )
}
