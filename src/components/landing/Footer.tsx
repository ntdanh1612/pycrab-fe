import { Container } from "@/components/ui/container"

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Gift Cards", href: "/gift-cards" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Reviews", href: "/reviews" },
    { label: "Careers", href: "/careers" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
}

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { label: "Pinterest", href: "https://pinterest.com", icon: "pinterest" },
]

export function Footer() {
  return (
    <footer className="bg-muted py-12 mt-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Gift & Souvenir. All rights reserved.
            </p>
            <div className="flex gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
} 