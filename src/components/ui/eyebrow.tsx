import * as React from "react"

import { cn } from "@/lib/utils"

// The shared eyebrow used above every section heading (Case Studies,
// Quality Lift, How It Works, etc.). Plain-text, Satoshi (font-sans),
// muted — no chip background, no uppercase, no extra tracking. Use this
// for any new eyebrow rather than re-inlining the same className combo.

type EyebrowProps = React.HTMLAttributes<HTMLParagraphElement>

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-sans text-xs text-[var(--text-muted)]",
        className,
      )}
      {...props}
    />
  )
}
