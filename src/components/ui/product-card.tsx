import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart.store'
import { useWishlistStore } from '@/stores/wishlist.store'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
  isBestSeller?: boolean
  discount?: number
}

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
}

export function ProductCard({ product, className, ...props }: ProductCardProps) {
  const { name, price, image, category, isNew, isBestSeller, discount } = product
  const navigate = useNavigate()
  const { addItem, isInCart } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  
  const productInCart = isInCart(product.id)
  const productInWishlist = isInWishlist(product.id)
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation to product detail
    addItem(product, 1)
  }
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation to product detail
    toggleItem(product)
  }
  
  const handleCardClick = () => {
    navigate(`/products/${product.id}`)
  }

  return (
    <Card
      className={cn(
        'group overflow-hidden border-secondary/20 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer',
        className
      )}
      onClick={handleCardClick}
      {...props}
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isNew && <Badge className="bg-primary text-primary-foreground">New</Badge>}
          {isBestSeller && (
            <Badge className="bg-accent text-accent-foreground font-medium hover:text-destructive-foreground">
              Best Seller
            </Badge>
          )}
          {discount && (
            <Badge className="bg-destructive text-destructive-foreground font-medium">
              {discount}% OFF
            </Badge>
          )}
        </div>
        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="default" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white text-primary hover:bg-red-50 hover:border-red-200 hover:text-red-500 shadow-md"
            onClick={handleToggleWishlist}
            aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${productInWishlist ? "fill-red-500 text-red-500" : "text-red-500"}`} />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full bg-white text-primary hover:bg-primary hover:text-white shadow-md"
            onClick={handleAddToCart}
            aria-label={productInCart ? "Already in cart" : "Add to cart"}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 bg-gradient-to-b from-white to-secondary/5">
        <div className="text-sm text-muted-foreground">{category}</div>
        <h3 className="mt-1 font-medium text-foreground transition-colors duration-300 group-hover:text-destructive">
          {name}
        </h3>
      </CardContent>
      <CardFooter className="p-4 pt-0 bg-gradient-to-t from-white to-secondary/5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {discount ? (
              <>
                <span className="font-bold text-primary">
                  ${(price * (1 - discount / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-bold text-primary">${price.toFixed(2)}</span>
            )}
          </div>
          <Link 
            to={`/products/${product.id}`} 
            className="text-sm font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
