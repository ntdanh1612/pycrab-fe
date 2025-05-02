import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/ui/product-card'
import { Separator } from '@/components/ui/separator'
import { Heart, ShoppingCart, MoveLeft, Check, Minus, Plus, Star } from 'lucide-react'
import { useProductsStore } from '@/stores/products.store'
import { useCartStore } from '@/stores/cart.store'
import { useWishlistStore } from '@/stores/wishlist.store'

// Mock variants for product
const sizeVariants = ['Small', 'Medium', 'Large']
const colorVariants = ['Natural', 'Ocean Blue', 'Sandy Beige', 'Tropical Green']
const styleVariants = ['Modern', 'Classic', 'Rustic']

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { getProductById, getRelatedProducts } = useProductsStore()
  const { addItem, isInCart } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState({
    size: 'Medium',
    color: 'Natural',
    style: 'Modern',
  })

  // Generate mock images from the main product image by adding a query param
  const mockGalleryImages = (url: string, count: number) => {
    return Array.from({ length: count }, (_, i) => `${url}?v=${i}`)
  }

  const product = getProductById(productId || '')
  const relatedProducts = getRelatedProducts(productId || '')

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [productId])

  if (!product) {
    return (
      <Container>
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the product you're looking for.
          </p>
          <Button onClick={() => navigate('/products')}>View All Products</Button>
        </div>
      </Container>
    )
  }

  const galleryImages = mockGalleryImages(product.image, 4)
  const productInCart = isInCart(product.id)
  const productInWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem(
      product,
      quantity,
      {
        size: selectedVariants.size,
        color: selectedVariants.color,
        style: selectedVariants.style,
      }
    )
  }

  const handleToggleWishlist = () => {
    toggleItem(product)
  }

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value))
  }

  return (
    <section className="py-12">
      <Container>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={() => navigate('/products')}
        >
          <MoveLeft className="h-4 w-4 mr-2" /> Back to Products
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden border rounded-lg bg-secondary/20">
              <img
                src={galleryImages[selectedImage]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="text-xs">{product.category}</Badge>
                {product.isNew && (
                  <Badge variant="default" className="bg-primary text-xs">
                    New
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge variant="secondary" className="text-xs">
                    Best Seller
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(12 reviews)</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {product.discount ? (
                  <>
                    <span className="text-2xl font-bold text-primary">
                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="ml-2">
                      {product.discount}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">
                A beautiful {product.name.toLowerCase()} made with premium materials. This item is
                perfect as a gift or to enhance your own space with its elegant design and superb
                craftsmanship.
              </p>
            </div>

            <Separator />

            {/* Size Variants */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizeVariants.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={selectedVariants.size === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedVariants({ ...selectedVariants, size })}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Variants */}
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colorVariants.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={selectedVariants.color === color ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedVariants({ ...selectedVariants, color })}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Style Variants */}
              <div>
                <h3 className="font-medium mb-2">Style</h3>
                <div className="flex flex-wrap gap-2">
                  {styleVariants.map((style) => (
                    <Button
                      key={style}
                      type="button"
                      variant={selectedVariants.style === style ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedVariants({ ...selectedVariants, style })}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Quantity</h3>
                <div className="flex items-center w-36 h-10 border rounded-md">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-r-none h-full"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center font-medium">{quantity}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-l-none h-full"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  className="flex-1 sm:flex-none sm:min-w-[180px]"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  {productInCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant={productInWishlist ? 'default' : 'outline'}
                  size="icon"
                  className="size-12"
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`h-5 w-5 ${productInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Separator />
            <div className="space-y-4">
              <h3 className="font-medium">Product Details</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Handcrafted with premium materials</li>
                <li>Dimensions: 12" x 8" x 3" (varies by size)</li>
                <li>Weight: 1.2 lbs</li>
                <li>Ethically sourced and sustainable</li>
                <li>Perfect for home décor or as a special gift</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  )
} 