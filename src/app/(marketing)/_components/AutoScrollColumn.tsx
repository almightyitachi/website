import { cn } from "@/lib/utils"

interface AutoScrollColumnProps {
  items: React.ReactNode[]
  durationClass: string
  reverse?: boolean
  className?: string
}

// One column of a vertical infinite-scroll bento. Duplicates the items
// internally so the keyframe (0 → -50%) lands seamlessly. Duration is
// passed as a Tailwind arbitrary class (compile-time, not template-
// interpolated) so the CSS actually gets generated.
//
// Consumers pass `durationClass="[animation-duration:32s]"` etc. and
// optional `reverse` for organic mid-column motion. Pause-on-hover and
// reduced-motion handling are owned by the .scroll-y-track class.
export function AutoScrollColumn({
  items,
  durationClass,
  reverse = false,
  className,
}: AutoScrollColumnProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "scroll-y-track flex flex-col gap-3",
          durationClass,
          reverse && "[animation-direction:reverse]"
        )}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    </div>
  )
}
