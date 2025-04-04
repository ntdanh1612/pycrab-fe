import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "./card"
import { Badge } from "./badge"

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
    <Card className={cn("group overflow-hidden", className)} {...props}>
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isNew && <Badge variant="default">New</Badge>}
          {isBestSeller && <Badge variant="secondary">Best Seller</Badge>}
          {discount && <Badge variant="destructive">{discount}% OFF</Badge>}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{category}</div>
        <h3 className="mt-1 font-medium leading-none">{name}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center gap-2">
          {discount ? (
            <>
              <span className="font-bold">${(price * (1 - discount / 100)).toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold">${price.toFixed(2)}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
} 