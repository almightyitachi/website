"use client"
import React from "react"
import { motion } from "framer-motion"

export type Testimonial = {
  text: string
  image: string
  name: string
  role: string
}

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  key={i}
                  className="w-full max-w-xs rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-7 shadow-sm"
                >
                  <p className="text-[15px] leading-[1.55] text-[var(--text-body)]">
                    {text}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold leading-5 tracking-tight text-[var(--text-primary)]">
                        {name}
                      </p>
                      <p className="text-xs leading-5 text-[var(--text-muted)]">
                        {role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}
