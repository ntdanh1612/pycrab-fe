import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter } from './card'
import { Badge } from './badge'

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

  return (
    <Card
      className={cn(
        'group overflow-hidden border-secondary/20 bg-white shadow-sm hover:shadow-md transition-all duration-300',
        className
      )}
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
      </div>
      <CardContent className="p-4 bg-gradient-to-b from-white to-secondary/5">
        <div className="text-sm text-muted-foreground">{category}</div>
        <h3 className="mt-1 font-medium text-foreground transition-colors duration-300 group-hover:text-destructive">
          {name}
        </h3>
      </CardContent>
      <CardFooter className="p-4 pt-0 bg-gradient-to-t from-white to-secondary/5">
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
      </CardFooter>
    </Card>
  )
}
