"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { cn } from "@/lib/utils"

export interface FloatingAvatar {
  id: number
  name: string
  imgSrc: string
  persona: "hr" | "tpo" | "student"
  quote: string
  className: string
  accent: "navy" | "amber" | "orange"
  stat: { value: string; label: string }
}

interface FloatingAvatarsHeroProps {
  avatars: FloatingAvatar[]
  className?: string
  children?: React.ReactNode
  /**
   * scrollYProgress of the parent hero section, 0 at "section top at
   * viewport top" and 1 at "section bottom at viewport top". When set,
   * each avatar translates toward the hero's bottom-center as the
   * progress climbs, fading and shrinking so the group converges into
   * the India-map area of the next section.
   */
  scrollProgress?: MotionValue<number>
}

const ACCENT = {
  navy:   { fg: "var(--color-brand-navy)",   bg: "var(--color-brand-navy-subtle)",   ring: "var(--color-brand-navy)" },
  amber:  { fg: "var(--color-brand-amber)",  bg: "var(--color-brand-amber-subtle)",  ring: "var(--color-brand-amber)" },
  orange: { fg: "var(--color-brand-orange)", bg: "var(--color-brand-orange-subtle)", ring: "var(--color-brand-orange)" },
} as const

const PERSONA_LABEL = {
  hr:      "Corporate HR",
  tpo:     "College TPO",
  student: "Student",
} as const

function AvatarTile({
  mouseX,
  mouseY,
  avatar,
  index,
  scrollProgress,
}: {
  mouseX: React.MutableRefObject<number>
  mouseY: React.MutableRefObject<number>
  avatar: FloatingAvatar
  index: number
  scrollProgress: MotionValue<number>
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const ref = React.useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = React.useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  // Convergence target — re-measured on mount and resize. Each avatar
  // computes the (Δx, Δy) it needs to travel to reach the hero's
  // bottom-centre, where the India-map below visually receives it.
  const [target, setTarget] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const compute = () => {
      const el = wrapperRef.current
      if (!el) return
      const parent = el.offsetParent as HTMLElement | null
      if (!parent) return
      const r = el.getBoundingClientRect()
      const p = parent.getBoundingClientRect()
      const targetCx = p.left + p.width / 2
      const targetCy = p.bottom - 24 // small inset so they land just inside the section bottom
      setTarget({
        x: targetCx - (r.left + r.width / 2),
        y: targetCy - (r.top + r.height / 2),
      })
    }
    compute()
    window.addEventListener("resize", compute)
    return () => window.removeEventListener("resize", compute)
    // We only depend on the avatar id so each tile re-measures if its
    // className-driven origin changes; resize handles viewport changes.
  }, [avatar.id])

  // Hold the avatar in place for the first 30% of scroll, then animate
  // it to the target across the remaining 70% so the convergence
  // feels punchy rather than gradual.
  const scrollX = useTransform(
    scrollProgress,
    [0, 0.3, 1],
    [0, 0, target.x],
  )
  const scrollY = useTransform(
    scrollProgress,
    [0, 0.3, 1],
    [0, 0, target.y],
  )
  const scrollScale = useTransform(scrollProgress, [0, 0.3, 1], [1, 1, 0.18])
  const scrollOpacity = useTransform(
    scrollProgress,
    [0, 0.3, 0.85, 1],
    [1, 1, 0.55, 0],
  )

  React.useEffect(() => {
    const handle = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.sqrt((mouseX.current - cx) ** 2 + (mouseY.current - cy) ** 2)
      const halfSize = rect.width / 2
      // Catch zone — once the cursor reaches the tile, stop dodging so
      // onMouseEnter can fire and the chat bubble opens.
      if (hovered || dist <= halfSize + 6) {
        x.set(0)
        y.set(0)
        return
      }
      if (dist < 130) {
        const angle = Math.atan2(mouseY.current - cy, mouseX.current - cx)
        const range = 130 - (halfSize + 6)
        const force = ((130 - dist) / range) * 20
        x.set(-Math.cos(angle) * force)
        y.set(-Math.sin(angle) * force)
      } else {
        x.set(0)
        y.set(0)
      }
    }
    window.addEventListener("mousemove", handle)
    return () => window.removeEventListener("mousemove", handle)
  }, [x, y, mouseX, mouseY, hovered])

  const accent = ACCENT[avatar.accent]

  return (
    <motion.div
      ref={wrapperRef}
      style={{
        x: scrollX,
        y: scrollY,
        scale: scrollScale,
        opacity: scrollOpacity,
      }}
      className={cn("absolute", hovered ? "z-30" : "z-10", avatar.className)}
    >
      <motion.div
        ref={ref}
        style={{ x: springX, y: springY }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
        animate={
          hovered
            ? { x: 0, y: 0, rotate: 0 }
            : {
                y: [0, -8, 0, 8, 0],
                x: [0, 6, 0, -6, 0],
                rotate: [0, 3, 0, -3, 0],
              }
        }
        transition={
          hovered
            ? { duration: 0.2, ease: "easeOut" }
            : {
                duration: 6 + ((avatar.id * 13) % 5),
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }
        }
        className="relative"
      >
        <div
          className="size-10 overflow-hidden rounded-full border-2 bg-white shadow-md sm:size-12 md:size-14 lg:size-16"
          style={{ borderColor: accent.ring }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar.imgSrc}
            alt={`${avatar.name}, ${PERSONA_LABEL[avatar.persona]}`}
            width={80}
            height={80}
            className="size-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Chat bubble — appears on hover. Positioned above the avatar with a tail. */}
        <motion.div
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 6,
            scale: hovered ? 1 : 0.96,
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ pointerEvents: hovered ? "auto" : "none" }}
          className="absolute bottom-[calc(100%+10px)] left-1/2 z-30 w-max max-w-[200px] -translate-x-1/2"
        >
          <div
            className="relative rounded-md border px-2.5 py-1.5 shadow-md backdrop-blur-md"
            style={{
              background: accent.bg,
              borderColor: accent.fg,
            }}
          >
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span
                aria-hidden="true"
                className="block size-1.5 shrink-0 rounded-full"
                style={{ background: accent.fg }}
              />
              <p
                className="text-[12px] font-semibold leading-none tracking-[-0.01em] tabular-nums"
                style={{ color: accent.fg }}
              >
                {avatar.stat.value}
              </p>
              <p className="text-[10px] leading-none text-[var(--text-muted)]">
                {avatar.stat.label}
              </p>
            </div>
            <p className="mt-1 text-[10px] leading-none text-[var(--text-muted)]">
              {avatar.name} · {PERSONA_LABEL[avatar.persona]}
            </p>
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-full block size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r"
              style={{ background: accent.bg, borderColor: accent.fg }}
            />
          </div>
        </motion.div>
      </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function FloatingAvatarsHero({
  avatars,
  className,
  children,
  scrollProgress,
}: FloatingAvatarsHeroProps) {
  const mouseX = React.useRef(0)
  const mouseY = React.useRef(0)
  const internalProgress = useMotionValue(0)
  // Always pass a real MotionValue down so the AvatarTile hooks stay
  // stable across renders, even when no parent scroll progress is wired.
  const progress = scrollProgress ?? internalProgress

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    mouseX.current = e.clientX
    mouseY.current = e.clientY
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn("relative h-full w-full", className)}
    >
      <div className="absolute inset-0">
        {avatars.map((a, i) => (
          <AvatarTile
            key={a.id}
            mouseX={mouseX}
            mouseY={mouseY}
            avatar={a}
            index={i}
            scrollProgress={progress}
          />
        ))}
      </div>
      {children}
    </div>
  )
}
