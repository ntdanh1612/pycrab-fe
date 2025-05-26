import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart.store'
import { Minus, Plus, ShoppingBag, Trash2, MoveLeft, ShoppingCart } from 'lucide-react'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = () => {
    setIsProcessing(true)
    // Simulate checkout process
    setTimeout(() => {
      navigate('/checkout')
      setIsProcessing(false)
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <section className="py-16">
        <Container>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Looks like you haven't added any items to your cart yet. Browse our collection to find
              something special.
            </p>
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </div>
        </Container>
      </section>
    )
  }

  const subtotal = getTotalPrice()
  const shipping = 5.99
  const tax = subtotal * 0.08 // 8% tax for example
  const total = subtotal + shipping + tax

  return (
    <section className="py-12">
      <Container>
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <span className="text-lg text-muted-foreground">({getTotalItems()} items)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Cart Items */}
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/products')}
              className="mb-4"
            >
              <MoveLeft className="h-4 w-4 mr-2" /> Continue Shopping
            </Button>

            <div>
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-6 border-b last:border-b-0">
                  <div className="aspect-square h-24 sm:h-32 w-24 sm:w-32 flex-shrink-0">
                    <Link to={`/products/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </Link>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <Link to={`/products/${item.id}`} className="hover:text-primary">
                        <h3 className="font-medium">{item.name}</h3>
                      </Link>
                      <div className="font-bold">
                        ${((item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-2">
                      {item.category}
                    </div>

                    {item.selectedVariant && (
                      <div className="text-sm text-muted-foreground mb-2 space-y-1">
                        {item.selectedVariant.size && <div>Size: {item.selectedVariant.size}</div>}
                        {item.selectedVariant.color && <div>Color: {item.selectedVariant.color}</div>}
                        {item.selectedVariant.style && <div>Style: {item.selectedVariant.style}</div>}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border rounded-md">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="flex-1 w-10 text-center font-medium text-sm">
                          {item.quantity}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" size="sm" onClick={() => clearCart()}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24 bg-secondary/10 border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

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

              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 size-4 border-2 border-current border-t-transparent rounded-full" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" /> Proceed to Checkout
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Taxes and shipping calculated at checkout
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
} 