// PluginLive "P" mark — the geometric letterform from resources/letter-logo.png
// traced as a single monochrome silhouette: block stem, elliptical bowl, square
// counter. Renders in currentColor so each surface picks the colour (white on
// the dark chip, white on the cobalt shield).

// Native proportions of the traced mark (used for transforms when the path is
// embedded inside another SVG's coordinate space).
export const MARK_W = 93
export const MARK_H = 103

// Even-odd path: outer P silhouette + the rectangular counter knocked out.
export const MARK_PATH =
  "M0 0 H65 A28 38 0 0 1 93 38 A28 38 0 0 1 65 76 H28 V103 H0 Z M28 27.5 H65 V50 H28 Z"

export function PluginLiveMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MARK_W} ${MARK_H}`}
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path fillRule="evenodd" d={MARK_PATH} />
    </svg>
  )
}
