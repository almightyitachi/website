"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormState = "idle" | "loading" | "done" | "error"

// Early-access email capture. Validates client-side, then posts to
// /api/early-access (a stub that validates + 200s — not yet wired to a store).
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
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-[var(--text-primary)]">
        <CheckCircle2 size={18} className="text-[var(--color-primary-600)]" />
        You&rsquo;re on the list — we&rsquo;ll be in touch.
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm font-medium text-[var(--text-primary)]">
        Curious to see it first?
      </p>
      <p className="mt-1 text-[13px] text-[var(--text-muted)]">
        Drop your email and we&rsquo;ll send you early access.
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
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
          className="h-10 flex-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-disabled)] focus-visible:border-[var(--border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--border-focus)]/40"
        />
        <Button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Submitting…" : "Get early access"}
          {state !== "loading" && <ArrowRight size={15} className="ml-1" />}
        </Button>
      </form>

      {state === "error" && (
        <p className="mt-2 text-left text-[13px] text-[var(--text-danger)]">
          Please enter a valid email address.
        </p>
      )}
    </div>
  )
}
