"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z
    .string()
    .min(1, "Work email is required")
    .email("Enter a valid email"),
  org: z.string().min(2, "Add your company or college name"),
  audience: z.enum(["corporate", "tpo", "other"]),
})

type FormValues = z.infer<typeof schema>

export function BookMeetingForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { audience: "corporate" },
  })

  async function onSubmit(values: FormValues) {
    // Real wire-up is post-MVP. For now: console + simulated delay so the
    // button shows a "submitting" state and the success view replaces the form.
    await new Promise((r) => setTimeout(r, 600))
    // eslint-disable-next-line no-console
    console.log("Book a meeting payload:", values)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-white/[0.12] bg-white/[0.04] p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-[var(--color-accent-500)]/15">
          <CheckCircle2
            size={22}
            className="text-[var(--color-accent-500)]"
          />
        </div>
        <p className="mt-4 text-lg font-semibold text-white">
          We&apos;ll be in touch shortly.
        </p>
        <p className="mt-2 text-sm text-white/55">
          Our solutions team replies within 24 hours. Check your inbox for a
          calendar link.
        </p>
      </div>
    )
  }

  const audience = watch("audience")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <Input
            {...register("name")}
            placeholder="Anita Sharma"
            aria-invalid={errors.name ? "true" : undefined}
            className={cn(
              "bg-white/[0.05] text-white placeholder:text-white/35 border-white/[0.12] focus-visible:border-[var(--color-primary-400)] focus-visible:bg-white/[0.08]",
              errors.name && "border-[var(--color-error)]"
            )}
          />
        </Field>
        <Field label="Work email" error={errors.email?.message}>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@company.com"
            aria-invalid={errors.email ? "true" : undefined}
            className={cn(
              "bg-white/[0.05] text-white placeholder:text-white/35 border-white/[0.12] focus-visible:border-[var(--color-primary-400)] focus-visible:bg-white/[0.08]",
              errors.email && "border-[var(--color-error)]"
            )}
          />
        </Field>
      </div>

      <Field label="Company or college" error={errors.org?.message}>
        <Input
          {...register("org")}
          placeholder="e.g. Infosys, IIT Bombay"
          aria-invalid={errors.org ? "true" : undefined}
          className={cn(
            "bg-white/[0.05] text-white placeholder:text-white/35 border-white/[0.12] focus-visible:border-[var(--color-primary-400)] focus-visible:bg-white/[0.08]",
            errors.org && "border-[var(--color-error)]"
          )}
        />
      </Field>

      <Field label="You are a..." error={errors.audience?.message}>
        <Select
          value={audience}
          onValueChange={(v) =>
            setValue("audience", v as FormValues["audience"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="bg-white/[0.05] text-white border-white/[0.12] focus-visible:border-[var(--color-primary-400)] focus-visible:bg-white/[0.08] [&_svg]:text-white/55">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="corporate">Corporate recruiter</SelectItem>
            <SelectItem value="tpo">College / TPO</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Sending…" : "Book the call"}
      </Button>

      <p className="text-xs text-white/40">
        Reply within 24 hours · No credit card · 30-day pilot
      </p>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-white/55">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  )
}
