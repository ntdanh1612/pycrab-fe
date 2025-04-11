import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12 bg-gradient-to-b from-accent/10 to-cream">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
