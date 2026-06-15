"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"

import { cn } from "@/lib/utils"

export function TracingBeam({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)

  useEffect(() => {
    if (!contentRef.current) return
    const measure = () => {
      if (contentRef.current) setSvgHeight(contentRef.current.offsetHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [])

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    { stiffness: 500, damping: 90 },
  )
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    { stiffness: 500, damping: 90 },
  )

  return (
    <motion.div
      ref={ref}
      className={cn("relative w-full", className)}
    >
      <div className="absolute -left-12 top-3 hidden lg:block">
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{
            boxShadow:
              scrollYProgress.get() > 0
                ? "none"
                : "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-[var(--border-default)] shadow-sm"
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            animate={{
              backgroundColor:
                scrollYProgress.get() > 0
                  ? "var(--bg-elevated)"
                  : "var(--color-primary-600)",
              borderColor:
                scrollYProgress.get() > 0
                  ? "var(--bg-elevated)"
                  : "var(--color-primary-700)",
            }}
            className="h-2 w-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)]"
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="var(--color-neutral-300)"
            strokeOpacity="0.32"
            transition={{ duration: 10 }}
          />
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#platform-tracing-gradient)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
            transition={{ duration: 10 }}
          />
          <defs>
            <motion.linearGradient
              id="platform-tracing-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="var(--color-primary-300)" stopOpacity="0" />
              <stop stopColor="var(--color-primary-300)" />
              <stop offset="0.325" stopColor="var(--color-primary-600)" />
              <stop offset="1" stopColor="var(--color-primary-700)" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  )
}
