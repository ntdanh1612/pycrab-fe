import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.store'
import { useEffect, useState } from 'react'
import { supabaseAuthService } from '@/services/auth.supabase'
import { Heart, Search, UserCircle } from 'lucide-react'
import { CartIndicator } from '@/components/cart/CartIndicator'

const categories = [
  {
    title: 'Gifts',
    items: [
      { title: 'Birthday Gifts', href: '/category/birthday' },
      { title: 'Anniversary Gifts', href: '/category/anniversary' },
      { title: 'Wedding Gifts', href: '/category/wedding' },
      { title: 'Corporate Gifts', href: '/category/corporate' },
    ],
  },
  {
    title: 'Collections',
    items: [
      { title: 'New Arrivals', href: '/collections/new' },
      { title: 'Best Sellers', href: '/collections/best-sellers' },
      { title: 'Featured', href: '/collections/featured' },
      { title: 'Sale', href: '/collections/sale' },
    ],
  },
]

export function MainNav() {
  const { isAuthenticated, logout, user } = useAuthStore()
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if the current user is an admin
  useEffect(() => {
    if (isAuthenticated) {
      const checkAdminStatus = async () => {
        try {
          const adminStatus = await supabaseAuthService.isAdmin()
          setIsAdmin(adminStatus)
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        }
      }

      checkAdminStatus()
    } else {
      setIsAdmin(false)
    }
  }, [isAuthenticated])

  // Get first name from full name
  const firstName = user?.name ? user.name.split(' ')[0] : ''

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <span className="text-xl font-bold text-primary">TiDi Shop</span>
          </Link>
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/products"
                      className="inline-flex h-9 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/5 hover:text-primary focus:bg-primary/5 data-[active]:bg-primary/5 data-[state=open]:bg-primary/5 data-[state=open]:text-primary"
                    >
                      All Products
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {categories.map((category) => (
                  <NavigationMenuItem key={category.title}>
                    <NavigationMenuTrigger className="bg-transparent text-foreground hover:bg-primary/5 hover:text-primary focus:bg-primary/5 data-[active]:bg-primary/5 data-[state=open]:bg-primary/5 data-[state=open]:text-primary cursor-pointer">
                      {category.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-white rounded-lg border border-secondary/10 shadow-md">
                        {category.items.map((item) => (
                          <li key={item.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/20 hover:text-primary focus:bg-accent/20 focus:text-primary cursor-pointer"
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2">
              {/* Shopping icons */}
              <div className="flex items-center gap-1 mr-1">
                <Button variant="ghost" size="icon" aria-label="Search products" asChild>
                  <Link to="/products">
                    <Search className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" aria-label="View wishlist" asChild className="hover:bg-red-50">
                  <Link to="/wishlist">
                    <Heart className="h-5 w-5 text-red-500" />
                  </Link>
                </Button>
                <CartIndicator />
              </div>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center mr-2 text-foreground">
                    <UserCircle className="h-5 w-5 mr-1.5 text-primary/70" />
                    <span className="font-medium text-sm">Hi, {firstName}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin" className="text-primary">
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}
