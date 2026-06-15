"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface RadioCardOption {
  value: string
  label: string
  description?: string
}

interface RadioCardGroupProps {
  options: RadioCardOption[]
  value: string
  onChange: (value: string) => void
  name: string
  className?: string
}

export function RadioCardGroup({
  options,
  value,
  onChange,
  name,
  className,
}: RadioCardGroupProps) {
  return (
    <div role="radiogroup" className={cn("flex flex-col gap-3", className)}>
      {options.map((option) => {
        const isSelected = option.value === value
        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer flex-col gap-1 rounded-md border p-4 transition-colors",
              isSelected
                ? [
                    "border-[var(--border-brand)]",
                    "bg-[var(--bg-brand-subtle)]",
                  ]
                : [
                    "border-[var(--border-default)]",
                    "bg-[var(--bg-elevated)]",
                    "hover:border-[var(--border-strong)]",
                    "hover:bg-[var(--bg-surface)]",
                  ]
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              className={cn(
                "text-sm font-medium",
                isSelected
                  ? "text-[var(--text-brand)]"
                  : "text-[var(--text-body)]"
              )}
            >
              {option.label}
            </span>
            {option.description && (
              <span className="text-xs text-[var(--text-muted)]">
                {option.description}
              </span>
            )}
          </label>
        )
      })}
    </div>
  )
}
