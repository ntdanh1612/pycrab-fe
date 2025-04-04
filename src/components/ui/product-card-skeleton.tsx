import { Card, CardContent, CardFooter } from "./card"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="aspect-square animate-pulse bg-muted" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
      </CardFooter>
    </Card>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
} 