"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormState = "idle" | "loading" | "done" | "error"

// Early-access email capture, styled for the dark "Coming soon" band. Validates
// client-side, then posts to /api/early-access (a stub that validates + 200s —
// not yet wired to a store).
export function EarlyAccessForm() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>("idle")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setState("error")
      return
    }
    setState("loading")
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setState(res.ok ? "done" : "error")
    } catch {
      setState("error")
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
        <CheckCircle2 size={18} className="text-[var(--color-primary-300)]" />
        You&rsquo;re on the list — we&rsquo;ll be in touch.
      </div>
    )
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-2.5 text-left sm:flex-row"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === "error") setState("idle")
          }}
          placeholder="you@company.com"
          aria-label="Email address"
          aria-invalid={state === "error"}
          className="h-11 w-full min-w-0 rounded-md border border-white/15 bg-white/[0.05] px-4 text-sm text-white outline-none placeholder:text-white/35 focus-visible:border-[var(--color-primary-300)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-primary-300)]/30 sm:flex-1"
        />
        <Button
          type="submit"
          size="lg"
          disabled={state === "loading"}
          className="w-full shrink-0 sm:w-auto"
        >
          {state === "loading" ? "Submitting…" : "Get early access"}
          {state !== "loading" && <ArrowRight size={15} className="ml-1" />}
        </Button>
      </form>
      {state === "error" && (
        <p className="mt-2 text-[13px] text-red-300">
          Please enter a valid email address.
        </p>
      )}
    </div>
  )
}
