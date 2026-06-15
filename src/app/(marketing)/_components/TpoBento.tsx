import { Star } from "lucide-react"

import { AutoScrollColumn } from "./AutoScrollColumn"

interface Review {
  initials: string
  name: string
  credential: string
  quote: string
  rating?: number
}

const REVIEWS: Review[] = [
  {
    initials: "PM",
    name: "Prof. Manish Verma",
    credential: "TPO · IIT Bombay",
    quote:
      "We doubled our offer rate this season. Recruiters can see ranked candidates without us flying spreadsheets around.",
    rating: 5,
  },
  {
    initials: "AS",
    name: "Anita Sharma",
    credential: "TPO · BITS Pilani",
    quote:
      "The audit trail is the win. Every shortlist is defensible, every score is timestamped. No more 'why was X picked' calls.",
    rating: 5,
  },
  {
    initials: "RK",
    name: "Dr. Ravi Kulkarni",
    credential: "Placement Head · VIT Vellore",
    quote:
      "Onboarded 3,200 students in one weekend. Corporates ping us first now, and the placement-rate lift was real.",
    rating: 5,
  },
  {
    initials: "SN",
    name: "Sunita Nair",
    credential: "TPO · NIT Trichy",
    quote:
      "Our students said the proctored test felt fair. That's the comment I never used to hear with paper rounds.",
    rating: 5,
  },
  {
    initials: "DK",
    name: "Deepak K.",
    credential: "TPO · IIIT Hyderabad",
    quote:
      "Cohort dashboards alone justify the platform. I track placement rate, average package, and recruiter mix per batch.",
    rating: 5,
  },
  {
    initials: "MR",
    name: "Meera Rajan",
    credential: "TPO · Christ University",
    quote:
      "Smaller campuses finally have a recruiter audience. We've added six new corporates in two quarters.",
    rating: 5,
  },
  {
    initials: "VP",
    name: "Vikram Patil",
    credential: "TPO · COEP Pune",
    quote:
      "The drive setup that took us a fortnight on email now runs in 10 minutes. I have my afternoons back.",
    rating: 5,
  },
  {
    initials: "PG",
    name: "Priya Ghosh",
    credential: "TPO · Jadavpur University",
    quote:
      "Skill-ranked shortlists end the 'who gets the interview slot' arguments. Students see why they were or weren't picked.",
    rating: 5,
  },
  {
    initials: "AT",
    name: "Arvind Thirunavukkarasu",
    credential: "TPO · SRM University",
    quote:
      "Mobile-first proctoring matters more than people realise. Half our students still test on phones, and it works flawlessly.",
    rating: 5,
  },
  {
    initials: "SK",
    name: "Sneha Kapoor",
    credential: "TPO · LSR Delhi",
    quote:
      "Women's-college representation in recruiter shortlists doubled. Visibility is the unlock.",
    rating: 5,
  },
  {
    initials: "RM",
    name: "Rajat Mehra",
    credential: "TPO · DTU",
    quote:
      "EEO-compliant reports out of the box. Our legal team signed off in 20 minutes. Usually that review eats a whole quarter.",
    rating: 5,
  },
  {
    initials: "KS",
    name: "Kavita Singh",
    credential: "TPO · Manipal Institute",
    quote:
      "Best support I've had from any vendor. Issues resolved same-day, every time. They actually pick up the phone.",
    rating: 5,
  },
]

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[var(--bg-brand-subtle)] text-sm font-semibold text-[var(--color-primary-700)]">
          {review.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {review.name}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {review.credential}
          </p>
        </div>
      </div>
      {review.rating && (
        <div className="mt-3 flex items-center gap-0.5 text-[var(--color-primary-500)]">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
      )}
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">
        &ldquo;{review.quote}&rdquo;
      </p>
    </div>
  )
}

export function TpoBento() {
  // Distribute reviews across 3 columns so each column has 4 cards.
  const col1 = REVIEWS.slice(0, 4).map((r) => (
    <ReviewCard key={r.name} review={r} />
  ))
  const col2 = REVIEWS.slice(4, 8).map((r) => (
    <ReviewCard key={r.name} review={r} />
  ))
  const col3 = REVIEWS.slice(8, 12).map((r) => (
    <ReviewCard key={r.name} review={r} />
  ))

  return (
    <div
      className="relative grid max-h-[640px] grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-3"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <AutoScrollColumn
        items={col1}
        durationClass="[animation-duration:32s]"
      />
      <AutoScrollColumn
        items={col2}
        durationClass="[animation-duration:40s]"
        reverse
        className="hidden md:block"
      />
      <AutoScrollColumn
        items={col3}
        durationClass="[animation-duration:28s]"
        className="hidden lg:block"
      />
    </div>
  )
}
