import { Card, CardContent, CardFooter } from './card'

export function ProductCardSkeleton() {
  return (
    <Card className="group overflow-hidden border-secondary/20 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-secondary/5">
          <div className="absolute inset-0 bg-gradient-linear-90 from-transparent via-secondary/5 to-transparent animate-[sweep_1.5s_ease-in-out_infinite]"></div>
        </div>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <div className="h-5 rounded-full w-12 bg-secondary/10 overflow-hidden">
            <div className="h-full w-full bg-gradient-linear-90 from-transparent via-secondary/10 to-transparent animate-[sweep_1.5s_ease-in-out_0.1s_infinite]"></div>
          </div>
          <div className="h-5 rounded-full w-20 bg-secondary/10 overflow-hidden">
            <div className="h-full w-full bg-gradient-linear-90 from-transparent via-secondary/10 to-transparent animate-[sweep_1.5s_ease-in-out_0.2s_infinite]"></div>
          </div>
        </div>
      </div>
      <CardContent className="p-4 bg-gradient-to-b from-white to-secondary/5">
        {/* Category */}
        <div className="h-4 w-1/3 rounded bg-secondary/10 overflow-hidden">
          <div className="h-full w-full bg-gradient-linear-90 from-transparent via-secondary/10 to-transparent animate-[sweep_1.5s_ease-in-out_0.3s_infinite]"></div>
        </div>
        {/* Product name */}
        <div className="mt-1 h-5 w-5/6 rounded bg-secondary/10 overflow-hidden">
          <div className="h-full w-full bg-gradient-linear-90 from-transparent via-secondary/10 to-transparent animate-[sweep_1.5s_ease-in-out_0.4s_infinite]"></div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 bg-gradient-to-t from-white to-secondary/5">
        <div className="flex items-center gap-2">
          {/* Price */}
          <div className="h-5 w-16 rounded bg-secondary/10 overflow-hidden">
            <div className="h-full w-full bg-gradient-linear-90 from-transparent via-secondary/10 to-transparent animate-[sweep_1.5s_ease-in-out_0.5s_infinite]"></div>
          </div>
          {/* Discounted price (shows sometimes) */}
          <div className="h-4 w-12 rounded bg-secondary/10 overflow-hidden">
            <div className="h-full w-full bg-gradient-linear-90 from-transparent via-secondary/10 to-transparent animate-[sweep_1.5s_ease-in-out_0.6s_infinite]"></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Add this to global.css or App.css
// @keyframes shimmer {
//   0% {
//     background-position: -200% 0;
//   }
//   100% {
//     background-position: 200% 0;
//   }
// }
