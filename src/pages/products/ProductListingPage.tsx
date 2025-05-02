import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/container'
import { ProductCard } from '@/components/ui/product-card'
import { ProductCardSkeleton, ProductGridSkeleton } from '@/components/ui/product-card-skeleton'
import { useProductsStore } from '@/stores/products.store'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export default function ProductListingPage() {
  const {
    filteredProducts,
    categories,
    searchQuery,
    selectedCategory,
    sortBy,
    isLoading,
    loadProducts,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
  } = useProductsStore()

  const [isMounted, setIsMounted] = useState(false)
  const [localSearch, setLocalSearch] = useState('')

  useEffect(() => {
    setIsMounted(true)
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    if (isMounted) {
      setLocalSearch(searchQuery)
    }
  }, [isMounted, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(localSearch)
  }

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ]

  return (
    <section className="py-12">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Explore Our Products</h1>
            <p className="text-muted-foreground max-w-3xl">
              Discover our curated collection of unique gifts and souvenirs, perfect for
              commemorating special moments and creating lasting memories.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="w-full sm:max-w-md relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pr-12 bg-white border-2 border-accent/30 focus:border-transparent focus:outline focus:outline-primary/40 focus:outline-offset-0"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Filter button for mobile */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="enhanced-outline" size="sm" className="sm:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === null ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                        className="mr-2 mb-2"
                      >
                        All
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className="mr-2 mb-2"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="py-4">
                    <h3 className="font-medium mb-2">Sort By</h3>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={sortBy === option.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSortBy(option.value as any)}
                          className="mr-2 mb-2"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  options={sortOptions}
                  className="w-auto min-w-40"
                />
              </div>
            </div>
          </div>

          {/* Active filters */}
          {(selectedCategory || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            {/* Sidebar filters - desktop */}
            <div className="hidden md:block">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === null ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className="mr-2 mb-2"
                    >
                      All Products
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="mr-2 mb-2"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {isLoading ? (
                <ProductGridSkeleton />
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory(null)
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
