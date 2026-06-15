import { Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

// AI-narrated eyebrow chip. Sits above any AI-anchored section title
// and replaces the plain <Eyebrow> in the AI narrative variant. Carries
// the cobalt brand voltage so AI moments are visually consistent.

interface AiEyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

export function AiEyebrow({ children, className, ...rest }: AiEyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.12em] text-[var(--color-primary-600)]",
        className,
      )}
      {...rest}
    >
      <Sparkles size={12} strokeWidth={2.25} aria-hidden />
      {children}
    </span>
  )
}
