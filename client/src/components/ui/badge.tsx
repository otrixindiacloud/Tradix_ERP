import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm",
        secondary:
          "border-gray-200 bg-gray-50 text-gray-700 shadow-sm",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
        outline: "text-gray-700 border-gray-200 bg-white shadow-sm",
        success: "border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm",
        warning: "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm",
        info: "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
