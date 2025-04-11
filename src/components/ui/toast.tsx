import * as React from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toastVariants = cva(
  'fixed bottom-4 right-4 z-50 flex w-full max-w-md flex-col gap-2 rounded-md border p-4 shadow-md animate-in fade-in slide-in-from-bottom-5',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive bg-destructive text-destructive-foreground',
        success: 'border-green-600 bg-green-50 text-green-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string
  description: string
  action?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Toast({ title, description, action, variant, open, onOpenChange }: ToastProps) {
  if (!open) return null

  return (
    <div className={cn(toastVariants({ variant }))}>
      <div className="grid gap-1">
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-sm opacity-90">{description}</div>
      </div>
      <div className="flex items-center gap-2">
        {action}
        <button
          onClick={() => onOpenChange(false)}
          className="ml-auto rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:text-foreground hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
