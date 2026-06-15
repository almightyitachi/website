"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ─── Animated card primitives (Visual1) ─────────────────────────────────
// Ported from the upstream `animated-card` pattern to PluginLive tokens:
// max radius 6px (rounded-md), light surface only, neutral border, and a
// 396×196 surface (24 px wider than the previous chart card). The card
// carries the `group/animated-card` so its children can react to either
// real hover OR a parent-controlled `triggered` flag via `data-active`.

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Parent-controlled trigger that mirrors the hover-revealed state. */
  triggered?: boolean
}

export function AnimatedCard({
  className,
  triggered,
  ...props
}: AnimatedCardProps) {
  return (
    <div
      role="region"
      aria-labelledby="card-title"
      aria-describedby="card-description"
      data-active={triggered ? "true" : undefined}
      className={cn(
        "group/animated-card relative w-[396px] overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm",
        className,
      )}
      {...props}
    />
  )
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
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

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
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

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[13px] leading-[1.5] text-[var(--text-muted)]",
        className,
      )}
      {...props}
    />
  )
}

export function CardVisual({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-[196px] w-[396px] overflow-hidden", className)}
      {...props}
    />
  )
}

// ─── Visual1 — Ascending-bar reveal ─────────────────────────────────────
// Two layers slide on hover (or when the parent sets `triggered`):
//  • Layer1 — a bar field twice as wide as the card; sliding it left by 50%
//             reveals the ascending right half, simulating a rising trend.
//  • Layer2 — a wavy trend line + tinted fill; the trailing white sweep
//             slides off to the right, exposing the line.
// Layer3 carries two colour-coded chips (configurable via `labels`).
// Layer4 reveals a tooltip from the top.

interface Visual1Props {
  /** Active-state colour — used by the trend line, the radial ellipse,
   *  and (after hover / trigger) every bar in Layer1. */
  mainColor?: string
  /** Idle-state primary bar colour (e.g. brand-orange). */
  idleColor?: string
  /** Idle-state alternating bar colour — should sit in the same family
   *  as `idleColor` (a lighter shade). */
  idleColorAlt?: string
  /** Grid line colour. */
  gridColor?: string
  /** Parent-controlled active state — lock-in to the hover-revealed look. */
  triggered?: boolean
  /** Optional chip legend. Omit entirely (or pass nulls) to hide. */
  labels?: {
    primary?: string | null
    secondary?: string | null
  }
}

export function Visual1({
  mainColor = "var(--color-primary-600)",
  idleColor = "var(--color-brand-orange)",
  // No 400-step token exists on the brand-orange ramp yet; tailwind's
  // orange-400 (#FB923C) is the closest 400-shade lighter variant.
  idleColorAlt = "#FB923C",
  gridColor = "rgba(73,79,223,0.08)",
  triggered = false,
  labels,
}: Visual1Props) {
  return (
    <div
      aria-hidden
      data-active={triggered ? "true" : undefined}
      className="group/animated-card relative h-full w-full overflow-hidden rounded-t-md"
    >
      <Layer1
        idleColor={idleColor}
        idleColorAlt={idleColorAlt}
        activeColor={mainColor}
      />
      <Layer2 color={mainColor} />
      <Layer3
        color={mainColor}
        secondaryColor={idleColor}
        labels={labels}
      />
      <Layer4 />
      <EllipseGradient color={mainColor} />
      <GridLayer color={gridColor} />
    </div>
  )
}

// ─── Layers ─────────────────────────────────────────────────────────────

const GridLayer: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{ "--grid-color": color } as React.CSSProperties}
    className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
  />
)

const EllipseGradient: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute inset-0 z-[5] flex h-full w-full items-center justify-center">
    <svg
      width="396"
      height="196"
      viewBox="0 0 356 180"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="356" height="180" fill="url(#paint0_radial_visual1)" />
      <defs>
        <radialGradient
          id="paint0_radial_visual1"
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

// Layer1 — A bar field rendered twice the card width. Initial view shows
// the chaotic / mid bars on the left; sliding -50% on hover or when the
// parent triggers the card reveals the ascending right half.
//
// Bar fills go through CSS variables so two states can co-exist on the
// same SVG: idle = two shades of `idleColor` family, active = every bar
// in `activeColor`. The hover / data-active classes redefine both bar
// variables to the active colour in one swap.
const Layer1: React.FC<{
  idleColor: string
  idleColorAlt: string
  activeColor: string
}> = ({ idleColor, idleColorAlt, activeColor }) => (
  // Inline style on an OUTER wrapper carries the default colour vars.
  // The INNER wrapper carries the hover/active override classes. They're
  // on different elements so the class-based [--bar-1:...] overrides
  // win over the cascaded inline values — same-element inline always
  // beats same-element class, which is why the previous flat structure
  // never recoloured on hover.
  <div
    style={
      {
        "--bar-1": idleColor,
        "--bar-2": idleColorAlt,
        "--bar-active": activeColor,
      } as React.CSSProperties
    }
    className="absolute left-0 top-0 z-[6]"
  >
    <div
      className={
        "ease-[cubic-bezier(0.6,0.6,0,1)] transform transition-transform duration-500 " +
        "group-hover/animated-card:translate-x-[-50%] group-data-[active=true]/animated-card:translate-x-[-50%] " +
        "group-hover/animated-card:[--bar-1:var(--bar-active)] group-hover/animated-card:[--bar-2:var(--bar-active)] " +
        "group-data-[active=true]/animated-card:[--bar-1:var(--bar-active)] group-data-[active=true]/animated-card:[--bar-2:var(--bar-active)]"
      }
    >
    <svg
      className="w-[792px] [&_path]:transition-[fill] [&_path]:duration-500"
      viewBox="0 0 712 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M8 178C8 176.343 9.34315 175 11 175H25C26.6569 175 28 176.343 28 178V196H8V178Z" fill="var(--bar-1)" />
        <path d="M32 168C32 166.343 33.3431 165 35 165H49C50.6569 165 52 166.343 52 168V196H32V168Z" fill="var(--bar-2)" />
        <path d="M67 173C67 171.343 68.3431 170 70 170H84C85.6569 170 87 171.343 87 173V196H67V173Z" fill="var(--bar-1)" />
        <path d="M91 153C91 151.343 92.3431 150 94 150H108C109.657 150 111 151.343 111 153V196H91V153Z" fill="var(--bar-2)" />
        <path d="M126 142C126 140.343 127.343 139 129 139H143C144.657 139 146 140.343 146 142V196H126V142Z" fill="var(--bar-1)" />
        <path d="M150 158C150 156.343 151.343 155 153 155H167C168.657 155 170 156.343 170 158V196H150V158Z" fill="var(--bar-2)" />
        <path d="M187 133C187 131.343 188.343 130 190 130H204C205.657 130 207 131.343 207 133V196H187V133Z" fill="var(--bar-1)" />
        <path d="M211 161C211 159.343 212.343 158 214 158H228C229.657 158 231 159.343 231 161V196H211V161Z" fill="var(--bar-2)" />
        <path d="M248 150C248 148.343 249.343 147 251 147H265C266.657 147 268 148.343 268 150V196H248V150Z" fill="var(--bar-1)" />
        <path d="M272 130C272 128.343 273.343 127 275 127H289C290.657 127 292 128.343 292 130V196H272V130Z" fill="var(--bar-2)" />
        <path d="M307 133C307 131.343 308.343 130 310 130H324C325.657 130 327 131.343 327 133V196H307V133Z" fill="var(--bar-1)" />
        <path d="M331 155C331 153.343 332.343 152 334 152H348C349.657 152 351 153.343 351 155V196H331V155Z" fill="var(--bar-2)" />
        <path d="M363 161C363 159.343 364.343 158 366 158H380C381.657 158 383 159.343 383 161V196H363V161Z" fill="var(--bar-1)" />
        <path d="M387 144C387 142.343 388.343 141 390 141H404C405.657 141 407 142.343 407 144V196H387V144Z" fill="var(--bar-2)" />
        <path d="M423 126C423 124.343 424.343 123 426 123H440C441.657 123 443 124.343 443 126V196H423V126Z" fill="var(--bar-1)" />
        <path d="M447 142C447 140.343 448.343 139 450 139H464C465.657 139 467 140.343 467 142V196H447V142Z" fill="var(--bar-2)" />
        <path d="M483 125.461C483 124.102 484.343 123 486 123H500C501.657 123 503 124.102 503 125.461V196H483V125.461Z" fill="var(--bar-1)" />
        <path d="M507 137.507C507 136.122 508.343 135 510 135H524C525.657 135 527 136.122 527 137.507V196H507V137.507Z" fill="var(--bar-2)" />
        <path d="M543 108.212C543 106.438 544.343 105 546 105H560C561.657 105 563 106.438 563 108.212V196H543V108.212Z" fill="var(--bar-1)" />
        <path d="M567 116.485C567 115.112 568.343 114 570 114H584C585.657 114 587 115.112 587 116.485V196H567V116.485Z" fill="var(--bar-2)" />
        <path d="M603 79.8333C603 78.2685 604.343 77 606 77H620C621.657 77 623 78.2685 623 79.8333V196H603V79.8333Z" fill="var(--bar-1)" />
        <path d="M627 91.8919C627 90.2947 628.343 89 630 89H644C645.657 89 647 90.2947 647 91.8919V196H627V91.8919Z" fill="var(--bar-2)" />
        <path d="M661 66.7887C661 65.2485 662.343 64 664 64H678C679.657 64 681 65.2485 681 66.7887V196H661V66.7887Z" fill="var(--bar-1)" />
      <path d="M685 55.7325C685 54.2233 686.343 53 688 53H702C703.657 53 705 54.2233 705 55.7325V196H685V55.7325Z" fill="var(--bar-2)" />
    </svg>
    </div>
  </div>
)

// Layer2 — Trend line + tinted fill. The trailing white sweep slides off
// to the right when active, exposing the line beneath.
const Layer2: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute left-[-1px] top-0 h-full w-full">
    <svg
      className="h-full w-full"
      viewBox="0 0 356 180"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_visual1)">
        <path
          d="M1 131.5L33.5 125.5L64 102.5L93.5 118.5L124.5 90L154 100.5L183.5 76L207.5 92L244.5 51L274.5 60.5L307.5 46L334.5 28.5L356.5 1"
          stroke={color}
        />
        <path
          d="M33.5 125.5L1 131.5V197H356.5V1L335 28.5L306.5 46L274.5 60.5L244.5 51L207.5 92L183.5 76L154 100.5L124.5 90L93.5 118.5L64 102.5L33.5 125.5Z"
          fill={color}
          fillOpacity="0.3"
        />
      </g>
      <defs>
        <clipPath id="clip0_visual1">
          <rect width="356" height="180" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <div className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute inset-0 z-[3] transform bg-gradient-to-r from-transparent from-0% to-[var(--bg-elevated)] to-15% transition-transform duration-500 group-hover/animated-card:translate-x-full group-data-[active=true]/animated-card:translate-x-full" />
  </div>
)

// Layer3 — Two coloured chips in the top-right (configurable labels).
interface Layer3Props {
  color: string
  secondaryColor: string
  labels?: { primary?: string | null; secondary?: string | null }
}

const Layer3: React.FC<Layer3Props> = ({ color, secondaryColor, labels }) => {
  const primary = labels?.primary === undefined ? "Tommy" : labels.primary
  const secondary =
    labels?.secondary === undefined ? "Megan" : labels.secondary
  if (primary === null && secondary === null) return null
  return (
    <div
      className="absolute right-4 top-4 z-[8] flex items-center gap-1"
      style={
        {
          "--chip-primary": color,
          "--chip-secondary": secondaryColor,
        } as React.CSSProperties
      }
    >
      {/* Secondary first so a comparison label like "Without" reads before
          "With PluginLive" left-to-right. */}
      {secondary !== null && (
        <div className="flex shrink-0 items-center rounded-sm border border-[var(--border-default)] bg-white/70 px-1.5 py-0.5 backdrop-blur-sm transition-opacity duration-300 ease-in-out group-hover/animated-card:opacity-0 group-data-[active=true]/animated-card:opacity-0">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--chip-secondary)" }}
          />
          <span className="ml-1 text-[10px] font-medium text-[var(--text-primary)]">
            {secondary}
          </span>
        </div>
      )}
      {primary !== null && (
        <div className="flex shrink-0 items-center rounded-sm border border-[var(--border-default)] bg-white/70 px-1.5 py-0.5 backdrop-blur-sm transition-opacity duration-300 ease-in-out group-hover/animated-card:opacity-0 group-data-[active=true]/animated-card:opacity-0">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--chip-primary)" }}
          />
          <span className="ml-1 text-[10px] font-medium text-[var(--text-primary)]">
            {primary}
          </span>
        </div>
      )}
    </div>
  )
}

// Layer4 — A tooltip box that drops in from above when the card activates.
const Layer4: React.FC = () => (
  <div className="relative h-full w-full">
    <div className="ease-[cubic-bezier(0.6,0.6,0,1)] absolute inset-0 z-[7] flex w-full -translate-y-full items-start justify-start bg-transparent p-4 transition-transform duration-500 group-hover/animated-card:translate-y-0 group-data-[active=true]/animated-card:translate-y-0">
      <div className="rounded-sm border border-[var(--border-default)] bg-white/80 p-2 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-500 group-hover/animated-card:opacity-100 group-data-[active=true]/animated-card:opacity-100">
        <p className="mb-0.5 text-[12px] font-semibold text-[var(--text-primary)]">
          With PluginLive · 2.4× offers per recruiter
        </p>
        <p className="text-[11px] text-[var(--text-muted)]">
          Pre-vetted shortlist · ranked by proctored score
        </p>
      </div>
    </div>
  </div>
)
