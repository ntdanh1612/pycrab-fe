import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Container } from "@/components/ui/container"

const categories = [
  {
    title: "Gifts",
    items: [
      { title: "Birthday Gifts", href: "/category/birthday" },
      { title: "Anniversary Gifts", href: "/category/anniversary" },
      { title: "Wedding Gifts", href: "/category/wedding" },
      { title: "Corporate Gifts", href: "/category/corporate" },
    ],
  },
  {
    title: "Souvenirs",
    items: [
      { title: "Local Crafts", href: "/category/local-crafts" },
      { title: "Traditional Art", href: "/category/traditional-art" },
      { title: "Regional Specialties", href: "/category/regional" },
      { title: "Cultural Items", href: "/category/cultural" },
    ],
  },
  {
    title: "Collections",
    items: [
      { title: "New Arrivals", href: "/collections/new" },
      { title: "Best Sellers", href: "/collections/best-sellers" },
      { title: "Featured", href: "/collections/featured" },
      { title: "Sale", href: "/collections/sale" },
    ],
  },
]

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Gift & Souvenir</span>
          </a>
          <NavigationMenu>
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category.title}>
                  <NavigationMenuTrigger>{category.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {category.items.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <a
                              href={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Container>
    </header>
  )
} 