import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, FileText, Home } from 'lucide-react'

export default function OrderConfirmationPage() {
  const navigate = useNavigate()

  // Generate a random order number
  const orderNumber = `GFT-${Math.floor(100000 + Math.random() * 900000)}`
  
  // Generate a random date 3-7 days from now for delivery
  const getDeliveryDate = () => {
    const today = new Date()
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + Math.floor(Math.random() * 5) + 3)
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <section className="py-16">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <p className="text-primary font-medium">Order #{orderNumber}</p>
          </div>

          <div className="bg-secondary/10 border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start border-b pb-4">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Delivery Information</h3>
                  <p className="text-muted-foreground">
                    Your order is estimated to arrive by {getDeliveryDate()}.
                  </p>
                  <p className="text-muted-foreground">
                    A confirmation email has been sent to your email address.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start border-b pb-4">
                <Home className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Shipping Address</h3>
                  <p className="text-muted-foreground">
                    John Doe<br />
                    123 Ocean Drive<br />
                    Beach City, CA 90210<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Payment Information</h3>
                  <p className="text-muted-foreground">
                    Credit Card ending in **** 4242<br />
                    Billing address same as shipping
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg mb-8 overflow-hidden">
            <div className="bg-primary text-primary-foreground p-4 font-medium">
              Order Summary
            </div>
            <div className="p-4">
              <div className="space-y-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>$129.97</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>$5.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$10.40</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>$146.36</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
            <Button variant="outline" onClick={() => navigate('/account/orders')}>
              View Order History
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
} 