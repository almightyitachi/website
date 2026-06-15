import { Suspense } from "react"

import { NarrativeProvider } from "@/components/marketing/NarrativeContext"

// NarrativeProvider depends on useSearchParams (next/navigation), which
// triggers a Suspense boundary requirement during static rendering. The
// Suspense boundary covers that read so the layout still pre-renders
// cleanly under `next build`.
//
// data-surface="website" activates the website radius scope (see
// globals.css): lg 12px / xl 16px for cards and panels. display:contents
// carries the attribute for CSS variable scoping with zero layout impact.
// The platform never sets this attribute and stays on the 6px cap.

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // The surface wrapper sits OUTSIDE the Suspense boundary so the radius
    // scope is present in the prerendered HTML (the boundary's fallback is
    // null while NarrativeProvider's useSearchParams resolves — inside it,
    // the scope would pop in only after hydration).
    <div data-surface="website" className="contents">
      <Suspense fallback={null}>
        <NarrativeProvider>{children}</NarrativeProvider>
      </Suspense>
    </div>
  )
}
