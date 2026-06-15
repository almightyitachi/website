"use client"

import * as React from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"

// ─── Card primitives ─────────────────────────────────────────────────
// Ported from the upstream "animated-card-chart" pattern to PluginLive
// tokens: max radius 6px (rounded-md), light surface only, neutral border.
// The card carries the `group/animated-card` so its children can react to
// either real hover OR a parent-controlled `active` flag via `data-active`.

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Externally-controlled trigger that mirrors the hover-revealed state. */
  active?: boolean
}

export function AnimatedCard({ className, active, ...props }: AnimatedCardProps) {
  return (
    <div
      role="region"
      aria-labelledby="card-title"
      aria-describedby="card-description"
      data-active={active ? "true" : undefined}
      className={cn(
        "group/animated-card relative w-[372px] overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm",
        className,
      )}
      {...props}
    />
  )
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="group"
      className={cn(
        "flex flex-col space-y-1.5 border-t border-[var(--border-default)] p-4",
        className,
      )}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[16px] font-semibold leading-tight tracking-tight text-[var(--text-primary)]",
        className,
      )}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[13px] leading-[1.5] text-[var(--text-muted)]", className)}
      {...props}
    />
  )
}

export function CardVisual({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-[196px] w-[372px] overflow-hidden", className)}
      {...props}
    />
  )
}

// ─── Visual3 — Bar-chart visual ──────────────────────────────────────
// Two states layered together. Default = chaotic, mixed-colour bars
// representing a noisy applicant pool. Active = clean rising staircase
// in primary indigo, representing the PluginLive talent network. The
// `triggered` prop lets a parent button drive the same animation that
// hover would.

interface Visual3Props {
  mainColor?: string
  secondaryColor?: string
  gridColor?: string
  /** When true, lock the visual to its "active / with-PluginLive" state. */
  triggered?: boolean
}

export function Visual3({
  mainColor = "var(--color-primary-600)",
  secondaryColor = "var(--color-brand-amber)",
  gridColor = "rgba(73,79,223,0.08)",
  triggered = false,
}: Visual3Props) {
  const [hovered, setHovered] = useState(false)
  const active = hovered || triggered

  return (
    <>
      <div
        className="absolute inset-0 z-20"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={
          {
            "--chart-main": mainColor,
            "--chart-secondary": secondaryColor,
          } as React.CSSProperties
        }
      />

      <div className="relative h-[196px] w-[372px] overflow-hidden rounded-t-md">
        <Layer4
          color={mainColor}
          secondaryColor={secondaryColor}
          active={active}
        />
        <Layer3 color={mainColor} />
        <Layer2 />
        <Layer1 color={mainColor} secondaryColor={secondaryColor} />
        <EllipseGradient color={mainColor} />
        <GridLayer color={gridColor} />
      </div>
    </>
  )
}

// ─── Layers ──────────────────────────────────────────────────────────

const GridLayer: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{ "--grid-color": color } as React.CSSProperties}
    className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
  />
)

const EllipseGradient: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute inset-0 z-[5] flex h-full w-full items-center justify-center">
    <svg
      width="372"
      height="196"
      viewBox="0 0 356 180"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="356" height="180" fill="url(#paint0_radial_quality_chart)" />
      <defs>
        <radialGradient
          id="paint0_radial_quality_chart"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(178 98) rotate(90) scale(98 178)"
        >
          <stop stopColor={color} stopOpacity="0.22" />
          <stop offset="0.34" stopColor={color} stopOpacity="0.12" />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
)

// Layer1 — "without PluginLive" baseline chips (hidden when active).
const Layer1: React.FC<{ color: string; secondaryColor: string }> = ({
  color,
  secondaryColor,
}) => (
  <div className="absolute left-4 top-4 z-[8] flex items-center gap-1">
    <div className="flex shrink-0 items-center rounded-sm border border-[var(--border-default)] bg-white/70 px-1.5 py-0.5 backdrop-blur-sm transition-opacity duration-300 ease-in-out group-hover/animated-card:opacity-0 group-data-[active=true]/animated-card:opacity-0">
      <div
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: secondaryColor }}
      />
      <span className="ml-1 text-[10px] font-medium text-[var(--text-primary)]">
        62% noise
      </span>
    </div>
    <div className="flex shrink-0 items-center rounded-sm border border-[var(--border-default)] bg-white/70 px-1.5 py-0.5 backdrop-blur-sm transition-opacity duration-300 ease-in-out group-hover/animated-card:opacity-0 group-data-[active=true]/animated-card:opacity-0">
      <div
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      <span className="ml-1 text-[10px] font-medium text-[var(--text-primary)]">
        23% offers
      </span>
    </div>
  </div>
)

// Layer2 — "with PluginLive" tooltip (reveals when active).
const Layer2: React.FC = () => (
  <div className="relative h-full w-[372px]">
    <div className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute inset-0 z-[7] flex w-[372px] translate-y-full items-start justify-center bg-transparent p-4 transition-transform duration-500 group-hover/animated-card:translate-y-0 group-data-[active=true]/animated-card:translate-y-0">
      <div className="ease-[cubic-bezier(0.6,0,1)] rounded-sm border border-[var(--border-default)] bg-white/85 p-2 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-500 group-hover/animated-card:opacity-100 group-data-[active=true]/animated-card:opacity-100">
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: "var(--color-primary-600)" }}
          />
          <p className="text-[12px] font-semibold text-[var(--text-primary)]">
            With PluginLive · 2.4× offers per recruiter
          </p>
        </div>
        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
          Pre-vetted shortlist · ranked by proctored score
        </p>
      </div>
    </div>
  </div>
)

// Layer3 — gradient sweep that fades in with the active state.
const Layer3: React.FC<{ color: string }> = ({ color }) => (
  <div className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute inset-0 z-[6] flex translate-y-full items-center justify-center opacity-0 transition-all duration-500 group-hover/animated-card:translate-y-0 group-hover/animated-card:opacity-100 group-data-[active=true]/animated-card:translate-y-0 group-data-[active=true]/animated-card:opacity-100">
    <svg
      width="372"
      height="196"
      viewBox="0 0 356 180"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="356" height="180" fill="url(#paint0_linear_quality_chart)" />
      <defs>
        <linearGradient
          id="paint0_linear_quality_chart"
          x1="178"
          y1="0"
          x2="178"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.35" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  </div>
)

// Layer4 — the bar chart itself.
// Default = chaotic mid-low bars in mixed amber + dim grey + primary
//          (noisy, unvetted pool).
// Active  = clean ascending staircase, all primary (PluginLive talent
//          network ranking by proctored score).
interface Layer4Props {
  color: string
  secondaryColor: string
  active: boolean
}

const Layer4: React.FC<Layer4Props> = ({ color, secondaryColor, active }) => {
  const rectsData = [
    { x: 40,  height: 24, y: 106, hoverHeight: 20, hoverY: 130, fill: secondaryColor, hoverFill: color },
    { x: 60,  height: 18, y: 112, hoverHeight: 28, hoverY: 122, fill: "currentColor", hoverFill: color },
    { x: 80,  height: 32, y: 98,  hoverHeight: 34, hoverY: 116, fill: color,          hoverFill: color },
    { x: 100, height: 22, y: 108, hoverHeight: 40, hoverY: 110, fill: secondaryColor, hoverFill: color },
    { x: 120, height: 30, y: 100, hoverHeight: 46, hoverY: 104, fill: "currentColor", hoverFill: color },
    { x: 140, height: 40, y: 90,  hoverHeight: 52, hoverY: 98,  fill: secondaryColor, hoverFill: color },
    { x: 160, height: 26, y: 104, hoverHeight: 58, hoverY: 92,  fill: color,          hoverFill: color },
    { x: 180, height: 48, y: 82,  hoverHeight: 64, hoverY: 86,  fill: "currentColor", hoverFill: color },
    { x: 200, height: 20, y: 110, hoverHeight: 70, hoverY: 80,  fill: secondaryColor, hoverFill: color },
    { x: 220, height: 32, y: 98,  hoverHeight: 76, hoverY: 74,  fill: color,          hoverFill: color },
    { x: 240, height: 44, y: 86,  hoverHeight: 82, hoverY: 68,  fill: "currentColor", hoverFill: color },
    { x: 260, height: 22, y: 108, hoverHeight: 88, hoverY: 62,  fill: secondaryColor, hoverFill: color },
    { x: 280, height: 30, y: 100, hoverHeight: 94, hoverY: 56,  fill: color,          hoverFill: color },
    { x: 300, height: 38, y: 92,  hoverHeight: 100, hoverY: 50, fill: "currentColor", hoverFill: color },
  ]

  return (
    <div className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute inset-0 z-[8] flex h-[196px] w-[372px] items-center justify-center text-[var(--color-neutral-300)] transition-transform duration-500 group-hover/animated-card:scale-[1.12] group-data-[active=true]/animated-card:scale-[1.12]">
      <svg
        width="372"
        height="196"
        viewBox="0 0 356 180"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {rectsData.map((rect, index) => (
          <rect
            key={index}
            width={15}
            height={active ? rect.hoverHeight : rect.height}
            x={rect.x}
            y={active ? rect.hoverY : rect.y}
            fill={active ? rect.hoverFill : rect.fill}
            rx="2"
            ry="2"
            className="ease-[cubic-bezier(0.6,0.6,0,1)] transition-all duration-500"
          />
        ))}
      </svg>
    </div>
  )
}
