"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

// Fits a fixed-design-size graphic into any container by uniform transform
// scale (≤1 — never upscales). Used for Section 4 graphics whose HTML node
// layers carry fixed pixel sizes (chips, labels) that would otherwise clip or
// overflow on narrow phones. Children render at the design size, so all their
// internal pixel maths stay valid; only the painted result shrinks.
export function ScaledGraphic({
  designWidth,
  designHeight,
  children,
  className,
}: {
  designWidth: number
  designHeight: number
  children: ReactNode
  className?: string
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const measure = () => {
      const s = Math.min(
        1,
        el.clientWidth / designWidth,
        el.clientHeight > 0 ? el.clientHeight / designHeight : 1,
      )
      setScale(s)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [designWidth, designHeight])

  return (
    <div
      ref={outerRef}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div
        className="shrink-0"
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {children}
      </div>
    </div>
  )
}
