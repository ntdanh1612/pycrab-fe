import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart.store'

export function CartIndicator() {
  const navigate = useNavigate()
  const { getTotalItems, items } = useCartStore()
  
  const totalItems = getTotalItems()
  const hasItems = totalItems > 0

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate('/cart')}
      className="relative"
      aria-label={`Cart with ${totalItems} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {hasItems && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full size-5">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Button>
  )
} 