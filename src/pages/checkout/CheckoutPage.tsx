import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartStore } from '@/stores/cart.store'

type ShippingMethod = {
  id: string
  name: string
  description: string
  price: number
  estimatedDelivery: string
}

const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 5.99,
    estimatedDelivery: '5-7 business days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 12.99,
    estimatedDelivery: '2-3 business days',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day delivery',
    price: 24.99,
    estimatedDelivery: 'Next business day',
  },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCartStore()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    sameAsBilling: true,
  })
  
  const [selectedShipping, setSelectedShipping] = useState<string>(shippingMethods[0].id)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, sameAsBilling: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate processing
    setTimeout(() => {
      // In a real app, this would submit to an API
      clearCart()
      navigate('/checkout/success')
      setIsProcessing(false)
    }, 2000)
  }

  const subtotal = getTotalPrice()
  const selectedShippingMethod = shippingMethods.find((m) => m.id === selectedShipping)!
  const shipping = selectedShippingMethod.price
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  // If no items in cart, redirect to cart page
  if (items.length === 0) {
    return (
      <section className="py-16">
        <Container>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-12">
      <Container>
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            {/* Shipping Information */}
            <div className="space-y-8">
              {/* Shipping Address */}
              <div className="bg-secondary/10 border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-foreground">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-accent/20 focus:border-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-accent/20 focus:border-primary/30"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-accent/20 focus:border-primary/30"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-accent/20 focus:border-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-accent/20 focus:border-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-accent/20 focus:border-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-accent/20 focus:border-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-accent/20 focus:border-primary/30"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="sameAsBilling"
                    checked={formData.sameAsBilling}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="sameAsBilling" className="text-sm font-normal text-foreground">
                    Billing address is the same as shipping address
                  </Label>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-secondary/10 border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-foreground">Shipping Method</h2>
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedShipping === method.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-secondary/20'
                      }`}
                      onClick={() => setSelectedShipping(method.id)}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-4 rounded-full border ${
                              selectedShipping === method.id
                                ? 'border-primary'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {selectedShipping === method.id && (
                              <div className="size-2 m-0.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="font-medium">{method.name}</span>
                        </div>
                        <span className="font-bold">${method.price.toFixed(2)}</span>
                      </div>
                      <div className="ml-6 text-sm text-muted-foreground">
                        {method.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-24 bg-secondary/10 border rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 py-2">
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <div className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </div>
                          </div>
                          <div className="font-medium text-sm">
                            $
                            {(
                              (item.discount
                                ? item.price * (1 - item.discount / 100)
                                : item.price) * item.quantity
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 size-4 border-2 border-current border-t-transparent rounded-full" />
                      Processing Order...
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </section>
  )
} 