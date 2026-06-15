import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Building2,
  FilePlus,
  MonitorCheck,
  ShieldCheck,
  Trophy,
  Users,
  Workflow,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Step {
  Icon: React.ElementType
  title: string
  body: string
}

const CORPORATE_STEPS: Step[] = [
  {
    Icon: FilePlus,
    title: "Define the role",
    body: "JD, eligibility, drive type. 10 minutes from blank screen to live invite.",
  },
  {
    Icon: Users,
    title: "Browse the shortlist",
    body: "Pulled from the curated pool, ranked by fit to your filters.",
  },
  {
    Icon: MonitorCheck,
    title: "Run the assessment",
    body: "Proctored, any device, live monitoring dashboard.",
  },
  {
    Icon: Trophy,
    title: "Hire on merit",
    body: "Auto-ranked results in your pipeline. Move to interviews.",
  },
]

const TPO_STEPS: Step[] = [
  {
    Icon: Building2,
    title: "Onboard your students",
    body: "Bulk upload or integrate your placement portal. We handle the rest.",
  },
  {
    Icon: ShieldCheck,
    title: "Showcase placements",
    body: "Every drive lifts your college's recruiter visibility.",
  },
  {
    Icon: Workflow,
    title: "Connect to corporates",
    body: "Opt into specific drives. Accept, decline, or co-host invitations.",
  },
  {
    Icon: BarChart3,
    title: "Track outcomes",
    body: "Placement rate, average package, top recruiters. All broken down by cohort.",
  },
]

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-sm">
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold leading-none text-[var(--color-primary-200)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex size-9 items-center justify-center rounded-md bg-[var(--bg-brand-subtle)]">
          <step.Icon size={16} className="text-[var(--text-brand)]" />
        </div>
      </div>
      <p className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
        {step.title}
      </p>
      <p className="text-sm leading-relaxed text-[var(--text-body)]">
        {step.body}
      </p>
    </div>
  )
}

export function AudienceTabs() {
  return (
    <Tabs defaultValue="corporate" className="w-full">
      <div className="flex justify-center">
        <TabsList className="grid h-auto w-full max-w-md grid-cols-2 rounded-md bg-[var(--bg-surface)] p-1">
          <TabsTrigger
            value="corporate"
            className="rounded-sm py-2.5 text-sm font-medium data-[state=active]:bg-[var(--bg-elevated)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-sm"
          >
            For Corporates
          </TabsTrigger>
          <TabsTrigger
            value="tpo"
            className="rounded-sm py-2.5 text-sm font-medium data-[state=active]:bg-[var(--bg-elevated)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-sm"
          >
            For College TPOs
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="corporate" className="mt-10">
        <div className="grid gap-4 lg:grid-cols-4">
          {CORPORATE_STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="#book"
            className="inline-flex items-center gap-2 text-base font-semibold text-[var(--text-brand)] underline-offset-4 hover:underline"
          >
            Start a drive
            <ArrowRight size={16} />
          </Link>
        </div>
      </TabsContent>

      <TabsContent value="tpo" className="mt-10">
        <div className="grid gap-4 lg:grid-cols-4">
          {TPO_STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="#book"
            className="inline-flex items-center gap-2 text-base font-semibold text-[var(--text-brand)] underline-offset-4 hover:underline"
          >
            Apply to join the network
            <ArrowRight size={16} />
          </Link>
        </div>
      </TabsContent>
    </Tabs>
  )
}
