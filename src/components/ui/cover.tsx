"use client"
import React, { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SparklesCore } from "@/components/ui/sparkles"

interface BeamSpec {
  position: number
  duration: number
  delay: number
  hoveredDelay: number
  hoveredRepeatDelay: number
}

export const Cover = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  const [hovered, setHovered] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const [containerWidth, setContainerWidth] = useState(0)
  const [beams, setBeams] = useState<BeamSpec[]>([])

  // Measure container + compute beam positions with stable random values
  // (computed once on mount, not on every render — React Compiler safe).
  useEffect(() => {
    const el = ref.current
    if (!el) return

    setContainerWidth(el.clientWidth)

    const height = el.clientHeight
    const numberOfBeams = Math.floor(height / 10)
    const specs: BeamSpec[] = Array.from(
      { length: numberOfBeams },
      (_, i) => ({
        position: (i + 1) * (height / (numberOfBeams + 1)),
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2 + 1,
        hoveredDelay: Math.random() * 0.8 + 0.2,
        hoveredRepeatDelay: Math.random() + 1,
      })
    )
    setBeams(specs)
  }, [])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      className="group/cover relative inline-block rounded-sm bg-[var(--bg-surface)] px-2 py-2 transition duration-200 hover:bg-[var(--bg-brand)]"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: 0.2,
              },
            }}
            className="absolute inset-0 h-full w-full overflow-hidden"
          >
            <motion.div
              animate={{
                translateX: ["-50%", "0%"],
              }}
              transition={{
                translateX: {
                  duration: 10,
                  ease: "linear",
                  repeat: Infinity,
                },
              }}
              className="flex h-full w-[200%]"
            >
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="h-full w-full"
                particleColor="#FFFFFF"
              />
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="h-full w-full"
                particleColor="#FFFFFF"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {beams.map((beam, index) => (
        <Beam
          key={index}
          hovered={hovered}
          duration={beam.duration}
          delay={beam.delay}
          hoveredDelay={beam.hoveredDelay}
          hoveredRepeatDelay={beam.hoveredRepeatDelay}
          width={containerWidth}
          style={{
            top: `${beam.position}px`,
          }}
        />
      ))}
      <motion.span
        key={String(hovered)}
        animate={{
          scale: hovered ? 0.8 : 1,
          x: hovered ? [0, -30, 30, -30, 30, 0] : 0,
          y: hovered ? [0, 30, -30, 30, -30, 0] : 0,
        }}
        exit={{
          filter: "none",
          scale: 1,
          x: 0,
          y: 0,
        }}
        transition={{
          duration: 0.2,
          x: {
            duration: 0.2,
            repeat: Infinity,
            repeatType: "loop",
          },
          y: {
            duration: 0.2,
            repeat: Infinity,
            repeatType: "loop",
          },
          scale: {
            duration: 0.2,
          },
          filter: {
            duration: 0.2,
          },
        }}
        className={cn(
          "relative z-20 inline-block text-[var(--text-primary)] transition duration-200 group-hover/cover:text-white",
          className
        )}
      >
        {children}
      </motion.span>
      <CircleIcon className="absolute -right-[2px] -top-[2px]" />
      <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
      <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.8} />
      <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={1.6} />
    </div>
  )
}

export const Beam = ({
  className,
  delay,
  duration,
  hovered,
  hoveredDelay = 0.5,
  hoveredRepeatDelay = 1.5,
  width = 600,
  ...svgProps
}: {
  className?: string
  delay?: number
  duration?: number
  hovered?: boolean
  hoveredDelay?: number
  hoveredRepeatDelay?: number
  width?: number
} & React.ComponentProps<typeof motion.svg>) => {
  const id = useId()

  return (
    <motion.svg
      width={width ?? "600"}
      height="1"
      viewBox={`0 0 ${width ?? "600"} 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-x-0 w-full", className)}
      {...svgProps}
    >
      <motion.path
        d={`M0 0.5H${width ?? "600"}`}
        stroke={`url(#svgGradient-${id})`}
      />

      <defs>
        <motion.linearGradient
          id={`svgGradient-${id}`}
          key={String(hovered)}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: "0%",
            x2: hovered ? "-10%" : "-5%",
            y1: 0,
            y2: 0,
          }}
          animate={{
            x1: "110%",
            x2: hovered ? "100%" : "105%",
            y1: 0,
            y2: 0,
          }}
          transition={{
            duration: hovered ? 0.5 : duration ?? 2,
            ease: "linear",
            repeat: Infinity,
            delay: hovered ? hoveredDelay : 0,
            repeatDelay: hovered ? hoveredRepeatDelay : delay ?? 1,
          }}
        >
          {/* Brand cobalt-violet beam: same color at center, transparent at the
              tail-ends. Replaces the original cyan/blue (#2EB9DF / #3b82f6). */}
          <stop stopColor="#494FDF" stopOpacity="0" />
          <stop stopColor="#494FDF" />
          <stop offset="1" stopColor="#494FDF" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  )
}

export const CircleIcon = ({
  className,
  delay: _delay,
}: {
  className?: string
  delay?: number
}) => {
  return (
    <div
      className={cn(
        "group pointer-events-none h-2 w-2 animate-pulse rounded-full bg-[var(--color-neutral-400)] opacity-20 group-hover/cover:hidden group-hover/cover:bg-white group-hover/cover:opacity-100",
        className
      )}
    ></div>
  )
}
