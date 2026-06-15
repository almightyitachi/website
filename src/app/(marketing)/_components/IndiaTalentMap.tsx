"use client"

// India talent map — choropleth heatmap. Each state is filled with a
// colour intensity proportional to its student pool depth (√-scaled so
// the gradient tracks perceived volume rather than raw spread).
// Numbers surface on hover via a floating tooltip. Clicking a state
// zooms in and overlays city-level Tier 1/2/3 dots with a detail panel,
// then click outside or press ✕ to return to the overview.

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

import statePathsJson from "./india-state-paths.json"
import { project } from "./india-projection"

const STATE_PATHS = statePathsJson as {
  viewBox: { w: number; h: number }
  bounds: { minx: number; miny: number; maxx: number; maxy: number }
  states: Record<string, { d: string; lng: number; lat: number }>
}

// State-id → ST_NM (the DataMeet shapefile's name field).
const ST_NM: Record<string, string> = {
  PB: "Punjab",
  DL: "Delhi",
  RJ: "Rajasthan",
  UP: "Uttar Pradesh",
  AS: "Assam",
  WB: "West Bengal",
  GJ: "Gujarat",
  MP: "Madhya Pradesh",
  OD: "Odisha",
  MH: "Maharashtra",
  TS: "Telangana",
  KA: "Karnataka",
  TN: "Tamil Nadu",
  KL: "Kerala",
}

// Reverse: shapefile state name → our id (used to wire SVG path events).
const NAME_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(ST_NM).map(([id, name]) => [name, id]),
)

export type StepKey = 1 | 2 | 3 | 4

type Tier = 1 | 2 | 3

interface City {
  name: string
  tier: Tier
  left: number
  top: number
  students: number
}

interface StateData {
  id: string
  name: string
  left: number
  top: number
  students: number
  colleges: number
  tier23Share: number
  drivesAudited: number
  isTier23: boolean
  cities: City[]
}

interface RawState {
  id: string
  name: string
  lng: number
  lat: number
  students: number
  colleges: number
  tier23Share: number
  drivesAudited: number
  isTier23: boolean
  cities: { name: string; tier: Tier; lng: number; lat: number; students: number }[]
}

const RAW_STATES: RawState[] = [
  {
    id: "PB", name: "Punjab", lng: 75.4154, lat: 30.8425, students: 1900, colleges: 28, tier23Share: 78, drivesAudited: 42, isTier23: true,
    cities: [
      { name: "Chandigarh", tier: 1, lng: 76.78, lat: 30.73, students: 720 },
      { name: "Ludhiana",   tier: 2, lng: 75.85, lat: 30.91, students: 540 },
      { name: "Amritsar",   tier: 2, lng: 74.87, lat: 31.63, students: 380 },
      { name: "Jalandhar",  tier: 3, lng: 75.58, lat: 31.33, students: 260 },
    ],
  },
  {
    id: "DL", name: "Delhi NCR", lng: 77.10, lat: 28.61, students: 3200, colleges: 38, tier23Share: 22, drivesAudited: 96, isTier23: false,
    cities: [
      { name: "Delhi",     tier: 1, lng: 77.21, lat: 28.61, students: 1500 },
      { name: "Noida",     tier: 1, lng: 77.32, lat: 28.58, students: 720 },
      { name: "Gurugram",  tier: 1, lng: 77.03, lat: 28.46, students: 640 },
      { name: "Faridabad", tier: 2, lng: 77.31, lat: 28.41, students: 340 },
    ],
  },
  {
    id: "RJ", name: "Rajasthan", lng: 73.8497, lat: 26.5844, students: 2200, colleges: 31, tier23Share: 71, drivesAudited: 48, isTier23: true,
    cities: [
      { name: "Jaipur",   tier: 2, lng: 75.79, lat: 26.92, students: 820 },
      { name: "Jodhpur",  tier: 2, lng: 73.02, lat: 26.24, students: 480 },
      { name: "Udaipur",  tier: 3, lng: 73.71, lat: 24.58, students: 320 },
      { name: "Kota",     tier: 3, lng: 75.86, lat: 25.21, students: 580 },
    ],
  },
  {
    id: "UP", name: "Uttar Pradesh", lng: 80.566, lat: 26.923, students: 4100, colleges: 65, tier23Share: 64, drivesAudited: 88, isTier23: true,
    cities: [
      { name: "Lucknow",   tier: 2, lng: 80.95, lat: 26.85, students: 980 },
      { name: "Kanpur",    tier: 2, lng: 80.33, lat: 26.45, students: 820 },
      { name: "Varanasi",  tier: 2, lng: 82.97, lat: 25.32, students: 720 },
      { name: "Agra",      tier: 3, lng: 78.01, lat: 27.18, students: 640 },
      { name: "Allahabad", tier: 3, lng: 81.85, lat: 25.43, students: 540 },
    ],
  },
  {
    id: "AS", name: "Assam", lng: 92.8257, lat: 26.3547, students: 1100, colleges: 17, tier23Share: 82, drivesAudited: 31, isTier23: true,
    cities: [
      { name: "Guwahati",  tier: 2, lng: 91.74, lat: 26.14, students: 580 },
      { name: "Dibrugarh", tier: 3, lng: 94.91, lat: 27.47, students: 280 },
      { name: "Silchar",   tier: 3, lng: 92.79, lat: 24.83, students: 240 },
    ],
  },
  {
    id: "WB", name: "West Bengal", lng: 87.984, lat: 23.8104, students: 3600, colleges: 52, tier23Share: 58, drivesAudited: 81, isTier23: false,
    cities: [
      { name: "Kolkata",   tier: 1, lng: 88.36, lat: 22.57, students: 1700 },
      { name: "Howrah",    tier: 2, lng: 88.31, lat: 22.59, students: 640 },
      { name: "Durgapur",  tier: 2, lng: 87.32, lat: 23.55, students: 580 },
      { name: "Siliguri",  tier: 3, lng: 88.43, lat: 26.72, students: 380 },
    ],
  },
  {
    id: "GJ", name: "Gujarat", lng: 71.5725, lat: 22.6984, students: 2800, colleges: 38, tier23Share: 51, drivesAudited: 64, isTier23: false,
    cities: [
      { name: "Ahmedabad", tier: 1, lng: 72.57, lat: 23.02, students: 1200 },
      { name: "Surat",     tier: 2, lng: 72.83, lat: 21.17, students: 720 },
      { name: "Vadodara",  tier: 2, lng: 73.18, lat: 22.31, students: 540 },
      { name: "Rajkot",    tier: 3, lng: 70.80, lat: 22.30, students: 340 },
    ],
  },
  {
    id: "MP", name: "Madhya Pradesh", lng: 78.2889, lat: 23.538, students: 1900, colleges: 27, tier23Share: 74, drivesAudited: 44, isTier23: true,
    cities: [
      { name: "Indore",   tier: 2, lng: 75.86, lat: 22.72, students: 720 },
      { name: "Bhopal",   tier: 2, lng: 77.41, lat: 23.26, students: 580 },
      { name: "Gwalior",  tier: 3, lng: 78.18, lat: 26.22, students: 320 },
      { name: "Jabalpur", tier: 3, lng: 79.96, lat: 23.18, students: 280 },
    ],
  },
  {
    id: "OD", name: "Odisha", lng: 84.4303, lat: 20.5139, students: 1700, colleges: 26, tier23Share: 69, drivesAudited: 38, isTier23: true,
    cities: [
      { name: "Bhubaneswar", tier: 2, lng: 85.82, lat: 20.30, students: 780 },
      { name: "Cuttack",     tier: 3, lng: 85.88, lat: 20.46, students: 480 },
      { name: "Rourkela",    tier: 3, lng: 84.85, lat: 22.26, students: 320 },
    ],
  },
  {
    id: "MH", name: "Maharashtra", lng: 76.1076, lat: 19.4515, students: 6800, colleges: 89, tier23Share: 33, drivesAudited: 142, isTier23: false,
    cities: [
      { name: "Mumbai",     tier: 1, lng: 72.88, lat: 19.08, students: 3200 },
      { name: "Pune",       tier: 1, lng: 73.86, lat: 18.52, students: 1800 },
      { name: "Nagpur",     tier: 2, lng: 79.09, lat: 21.15, students: 980 },
      { name: "Nashik",     tier: 2, lng: 73.79, lat: 19.99, students: 540 },
      { name: "Aurangabad", tier: 3, lng: 75.34, lat: 19.88, students: 280 },
    ],
  },
  {
    id: "TS", name: "Telangana", lng: 79.0084, lat: 17.8008, students: 3100, colleges: 42, tier23Share: 41, drivesAudited: 78, isTier23: false,
    cities: [
      { name: "Hyderabad",  tier: 1, lng: 78.49, lat: 17.39, students: 1800 },
      { name: "Warangal",   tier: 2, lng: 79.59, lat: 18.00, students: 780 },
      { name: "Karimnagar", tier: 3, lng: 79.13, lat: 18.44, students: 520 },
    ],
  },
  {
    id: "KA", name: "Karnataka", lng: 76.1674, lat: 14.7103, students: 5400, colleges: 76, tier23Share: 38, drivesAudited: 121, isTier23: false,
    cities: [
      { name: "Bangalore", tier: 1, lng: 77.59, lat: 12.97, students: 3400 },
      { name: "Mysore",    tier: 2, lng: 76.65, lat: 12.30, students: 880 },
      { name: "Mangalore", tier: 2, lng: 74.86, lat: 12.91, students: 640 },
      { name: "Hubli",     tier: 3, lng: 75.12, lat: 15.36, students: 480 },
    ],
  },
  {
    id: "TN", name: "Tamil Nadu", lng: 78.4083, lat: 11.0136, students: 4900, colleges: 67, tier23Share: 45, drivesAudited: 108, isTier23: false,
    cities: [
      { name: "Chennai",    tier: 1, lng: 80.27, lat: 13.08, students: 2400 },
      { name: "Coimbatore", tier: 2, lng: 76.95, lat: 11.02, students: 980 },
      { name: "Madurai",    tier: 2, lng: 78.12, lat: 9.93,  students: 720 },
      { name: "Trichy",     tier: 3, lng: 78.70, lat: 10.79, students: 580 },
      { name: "Salem",      tier: 3, lng: 78.15, lat: 11.66, students: 320 },
    ],
  },
  {
    id: "KL", name: "Kerala", lng: 76.4087, lat: 10.4504, students: 2500, colleges: 34, tier23Share: 56, drivesAudited: 52, isTier23: true,
    cities: [
      { name: "Kochi",      tier: 1, lng: 76.27, lat: 9.93,  students: 1000 },
      { name: "Trivandrum", tier: 2, lng: 76.94, lat: 8.52,  students: 740 },
      { name: "Calicut",    tier: 2, lng: 75.78, lat: 11.25, students: 460 },
      { name: "Thrissur",   tier: 3, lng: 76.21, lat: 10.52, students: 320 },
    ],
  },
]

const STATES: StateData[] = RAW_STATES.map((s) => {
  const { left, top } = project(s.lng, s.lat)
  return {
    id: s.id,
    name: s.name,
    left,
    top,
    students: s.students,
    colleges: s.colleges,
    tier23Share: s.tier23Share,
    drivesAudited: s.drivesAudited,
    isTier23: s.isTier23,
    cities: s.cities.map((c) => {
      const p = project(c.lng, c.lat)
      return { name: c.name, tier: c.tier, left: p.left, top: p.top, students: c.students }
    }),
  }
})

// O(1) lookup by id used during render
const ID_TO_STATE: Record<string, StateData> = Object.fromEntries(
  STATES.map((s) => [s.id, s]),
)

const STEP_LABELS: Record<StepKey, string> = {
  1: "pre-vetted students",
  2: "partner colleges",
  3: "from Tier 2/3 colleges",
  4: "drives audited",
}

const TIER_COLOR: Record<Tier, string> = {
  1: "var(--color-primary-600)",
  2: "var(--color-brand-amber)",
  3: "var(--color-brand-orange)",
}
const TIER_SUBTLE: Record<Tier, string> = {
  1: "var(--color-primary-50)",
  2: "var(--color-brand-amber-subtle)",
  3: "var(--color-brand-orange-subtle)",
}

const ZOOM = 2.4

// 5-step colour ramp — √-scaled so the gradient tracks perceived volume.
const HEAT_SHADES = [50, 100, 200, 300, 400] as const
type HeatShade = (typeof HEAT_SHADES)[number]

const STUDENTS_MIN = Math.min(...STATES.map((s) => s.students))
const STUDENTS_MAX = Math.max(...STATES.map((s) => s.students))

function heatShade(students: number): HeatShade {
  const lo = Math.sqrt(STUDENTS_MIN)
  const hi = Math.sqrt(STUDENTS_MAX)
  const t = (Math.sqrt(students) - lo) / (hi - lo)
  const idx = Math.min(HEAT_SHADES.length - 1, Math.floor(t * HEAT_SHADES.length))
  return HEAT_SHADES[idx]
}

function formatFull(s: StateData, step: StepKey): string {
  switch (step) {
    case 1: return s.students.toLocaleString() + "+"
    case 2: return s.colleges.toString()
    case 3: return s.tier23Share + "%"
    case 4: return s.drivesAudited.toString()
  }
}

// ─── Auto-demo cursor ──────────────────────────────────────────────────

interface DemoWaypoint {
  at: number
  stateId: string | null
  action: "hover" | "click" | "reset"
}

const DEMO_SEQUENCE: DemoWaypoint[] = [
  { at: 600,  stateId: "MH", action: "hover" },
  { at: 2400, stateId: "KA", action: "hover" },
  { at: 4000, stateId: "KA", action: "click" },
  { at: 6400, stateId: null,  action: "reset" },
  { at: 7200, stateId: "TS", action: "hover" },
  { at: 8800, stateId: "TN", action: "hover" },
]
const DEMO_LOOP_MS = 10400

function useDemoMode(enabled: boolean) {
  const [cursorPos, setCursorPos] = useState<{ left: number; top: number } | null>(null)
  const [demoHover, setDemoHover] = useState<string | null>(null)
  const [demoSelect, setDemoSelect] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const active = enabled && !cancelled

  const cancel = useCallback(() => setCancelled(true), [])

  useEffect(() => {
    if (!active) {
      setCursorPos(null)
      setDemoHover(null)
      setDemoSelect(null)
      return
    }

    let raf = 0
    let start: number | null = null

    const tick = (ts: number) => {
      if (!start) start = ts
      const elapsed = (ts - start) % DEMO_LOOP_MS

      let currentHover: string | null = null
      let currentSelect: string | null = null
      let targetId: string | null = null

      for (let i = DEMO_SEQUENCE.length - 1; i >= 0; i--) {
        const wp = DEMO_SEQUENCE[i]
        if (elapsed >= wp.at) {
          targetId = wp.stateId
          if (wp.action === "hover") currentHover = wp.stateId
          if (wp.action === "click") currentSelect = wp.stateId
          break
        }
      }

      if (targetId) {
        const st = STATES.find((s) => s.id === targetId)
        if (st) setCursorPos({ left: st.left, top: st.top })
      } else {
        setCursorPos({ left: 50, top: 35 })
      }

      setDemoHover(currentHover)
      setDemoSelect(currentSelect)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])

  return { cursorPos, demoHover, demoSelect, cancel, active }
}

// ─── Component ─────────────────────────────────────────────────────────

interface IndiaTalentMapProps {
  step: StepKey
  className?: string
  demoMode?: boolean
}

export function IndiaTalentMap({ step, className, demoMode = false }: IndiaTalentMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  const demo = useDemoMode(demoMode)
  const effectiveHoveredId = demo.active ? demo.demoHover : hoveredId
  const effectiveSelectedId = demo.active ? demo.demoSelect : selectedId

  const cancelDemo = demo.cancel
  const handleUserInteraction = useCallback(() => {
    if (demo.active) cancelDemo()
  }, [demo.active, cancelDemo])

  const hovered = useMemo(() => STATES.find((s) => s.id === effectiveHoveredId) ?? null, [effectiveHoveredId])
  const selected = useMemo(() => STATES.find((s) => s.id === effectiveSelectedId) ?? null, [effectiveSelectedId])

  const tx = selected ? 50 - selected.left * ZOOM : 0
  const ty = selected ? 50 - selected.top * ZOOM : 0
  const zoom = selected ? ZOOM : 1

  return (
    <div
      onPointerDown={handleUserInteraction}
      onMouseEnter={handleUserInteraction}
      className={cn(
        "relative aspect-[645/720] w-full overflow-hidden rounded-sm",
        className,
      )}
    >
      {/* Pan / zoom layer */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${tx}%, ${ty}%) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Choropleth SVG — each state path filled by pool density.
            Pointer events disabled while zoomed so the backdrop catcher
            handles the "return to overview" click. */}
        <svg
          aria-label="India talent network"
          viewBox={`0 0 ${STATE_PATHS.viewBox.w} ${STATE_PATHS.viewBox.h}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full select-none"
          style={{ pointerEvents: selectedId ? "none" : "auto" }}
        >
          {Object.entries(STATE_PATHS.states).map(([name, info]) => {
            const id = NAME_TO_ID[name]
            const stateData = id ? ID_TO_STATE[id] : null
            const isHovered = id === hoveredId
            const isSelected = id === selectedId

            const fill = stateData
              ? `var(--color-accent-${heatShade(stateData.students)})`
              : "rgba(255,255,255,0.06)"

            return (
              <path
                key={name}
                d={info.d}
                fill={fill}
                stroke={
                  isHovered || isSelected
                    ? "var(--color-primary-600)"
                    : "var(--color-neutral-700)"
                }
                strokeWidth={isHovered || isSelected ? 1.5 : 0.5}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{
                  transition: "fill 200ms ease-out, filter 150ms ease-out, opacity 200ms",
                  filter: isHovered ? "brightness(0.88)" : undefined,
                  opacity: selectedId && !isSelected ? 0.4 : 1,
                  cursor: stateData ? "pointer" : "default",
                }}
                onMouseEnter={() => {
                  if (id && stateData) setHoveredId(id)
                }}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  if (!id || !stateData) return
                  setSelectedId((prev) => (prev === id ? null : id))
                }}
              />
            )
          })}
        </svg>

        {/* City dots — rendered in the same coordinate space so the pan/zoom
            transform places them correctly over the zoomed state. */}
        {selected?.cities.map((city) => {
          const cityId = `${selected.id}-${city.name}`
          const isCityHovered = hoveredCity === cityId
          const color = TIER_COLOR[city.tier]
          return (
            <div
              key={cityId}
              onMouseEnter={() => setHoveredCity(cityId)}
              onMouseLeave={() => setHoveredCity(null)}
              className="absolute flex flex-col items-center gap-0.5"
              style={{
                left: `${city.left}%`,
                top: `${city.top}%`,
                transform: "translate(-50%, -50%)",
                // Counter-scale so dots and labels render at normal visual
                // size independent of the parent's scale(2.4).
                zoom: 1 / ZOOM,
              }}
            >
              <span
                className="block rounded-full ring-2 ring-white shadow-sm transition-all duration-150"
                style={{
                  background: color,
                  width: isCityHovered ? 14 : 10,
                  height: isCityHovered ? 14 : 10,
                }}
              />
              <div
                className="rounded-sm border px-1.5 py-0.5 shadow-sm whitespace-nowrap"
                style={{ background: "var(--bg-elevated)", borderColor: color }}
              >
                <p className="text-[10px] font-semibold leading-none text-[var(--text-primary)]">
                  {city.name}
                </p>
                {isCityHovered && (
                  <p
                    className="mt-0.5 text-[9px] tabular-nums leading-none"
                    style={{ color }}
                  >
                    T{city.tier} · {city.students.toLocaleString()}+
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Backdrop catcher — resets zoom on click outside city dots */}
      {selected && (
        <button
          aria-label="Reset map view"
          onClick={() => setSelectedId(null)}
          className="absolute inset-0 z-10 cursor-zoom-out bg-transparent"
        />
      )}

      {/* Detail panel — city breakdown for selected state. Bounded to the
          map height (with the list scrolling) so it never spills past a small
          container — e.g. the section-4 graphic frame on mobile. */}
      {selected && (
        <div className="absolute right-3 top-3 z-30 flex max-h-[calc(100%-24px)] w-[220px] max-w-[calc(100%-24px)] flex-col rounded-md border border-white/[0.10] bg-[var(--surface-elevated)] p-3 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-white/45">
                {selected.name}
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums tracking-[-0.01em] text-[var(--color-primary-300)]">
                {formatFull(selected, step)}
              </p>
              <p className="text-[10px] text-white/45">
                {STEP_LABELS[step]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close detail"
              className="-mr-1 -mt-1 inline-flex h-6 w-6 items-center justify-center rounded-sm text-white/45 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-white/[0.08] pt-2.5">
            {([1, 2, 3] as Tier[]).map((tier) => (
              <div key={tier} className="flex items-center gap-1">
                <span
                  className="block size-2 rounded-full"
                  style={{ background: TIER_COLOR[tier] }}
                />
                <span className="text-[10px] text-white/45">Tier {tier}</span>
              </div>
            ))}
          </div>

          <ul className="mt-2.5 min-h-0 flex-1 space-y-1 overflow-y-auto">
            {selected.cities.map((city) => (
              <li
                key={city.name}
                className="flex items-center justify-between gap-2 rounded-sm bg-white/[0.04] px-1.5 py-1"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="block size-1.5 shrink-0 rounded-full"
                    style={{ background: TIER_COLOR[city.tier] }}
                  />
                  <span className="truncate text-[11px] font-semibold text-white">
                    {city.name}
                  </span>
                </div>
                <span className="shrink-0 text-[10px] tabular-nums text-white/45">
                  {city.students.toLocaleString()}+
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hover tooltip — overview mode only (hidden while zoomed) */}
      {hovered && !selected && (
        <div
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-white/[0.10] bg-[var(--surface-elevated)] px-3 py-2 shadow-lg"
          style={{
            left: `clamp(60px, ${hovered.left}%, calc(100% - 60px))`,
            top: `${hovered.top}%`,
            marginTop: -22,
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-wide text-white/45">
            {hovered.name}
          </p>
          <p className="mt-0.5 text-base font-bold tabular-nums tracking-[-0.01em] text-[var(--color-primary-300)]">
            {formatFull(hovered, step)}
          </p>
          <p className="text-[10px] text-white/45">{STEP_LABELS[step]}</p>
        </div>
      )}

      {/* Auto-demo cursor */}
      {demo.active && demo.cursorPos && (
        <div
          className="pointer-events-none absolute z-40"
          style={{
            left: `${demo.cursorPos.left}%`,
            top: `${demo.cursorPos.top}%`,
            transition: "left 600ms cubic-bezier(0.4,0,0.2,1), top 600ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="white"
            className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
          >
            <path d="M5.65 3.15l13.14 9.5h-6.64l3.55 7.04-2.58 1.3-3.55-7.04-3.92 3.83V3.15z" />
          </svg>
        </div>
      )}
    </div>
  )
}
