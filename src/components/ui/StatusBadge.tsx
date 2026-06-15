import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const statusVariants = cva(
  "rounded-sm text-xs font-medium px-2 py-0.5 border",
  {
    variants: {
      status: {
        open: [
          "bg-[var(--color-accent-50)]",
          "text-[var(--color-accent-700)]",
          "border-[var(--color-accent-200)]",
        ],
        draft: [
          "bg-[var(--bg-warning-subtle)]",
          "text-[var(--text-warning)]",
          "border-[var(--color-warning)]/30",
        ],
        closed: [
          "bg-[var(--bg-surface)]",
          "text-[var(--color-neutral-600)]",
          "border-[var(--border-strong)]",
        ],
        cancelled: [
          "bg-[var(--bg-danger-subtle)]",
          "text-[var(--text-danger)]",
          "border-[var(--color-error)]/30",
        ],
        paused: [
          "bg-[var(--color-info-bg)]",
          "text-[var(--color-info)]",
          "border-[var(--color-info)]/30",
        ],
      },
    },
    defaultVariants: {
      status: "open",
    },
  }
)

type StatusBadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof statusVariants>

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(statusVariants({ status }), className)}
      {...props}
    />
  )
}
