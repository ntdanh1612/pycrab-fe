import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ui/product-card'
import { useWishlistStore } from '@/stores/wishlist.store'
import { useCartStore } from '@/stores/cart.store'
import { Heart, ShoppingCart } from 'lucide-react'

export default function WishlistPage() {
  const navigate = useNavigate()
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const { addItem } = useCartStore()

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addItem(item)
    })
    navigate('/cart')
  }

  if (items.length === 0) {
    return (
      <section className="py-16">
        <Container>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Save items you love to your wishlist. Review them anytime and easily move them to your
              cart.
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved to your wishlist
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAddAllToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Add All to Cart
            </Button>
            <Button variant="outline" onClick={() => clearWishlist()}>
              Clear Wishlist
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard product={item} />
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 text-destructive hover:bg-white"
                  onClick={() => removeItem(item.id)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
              <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  className="w-full"
                  onClick={() => {
                    addItem(item)
                    removeItem(item.id)
                    navigate('/cart')
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Move to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
} 