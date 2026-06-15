import Image from "next/image"
import logoSrc from "../../../public/logo.png"
import { cn } from "@/lib/utils"

export function Wordmark({
  className = "",
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <Image
      src={logoSrc}
      alt="PluginLive"
      // Optimisation target is decoupled from the displayed size (set via
      // className). We request a 160px-tall asset so the logo stays crisp
      // at the nav's 64px / footer's 56px display sizes on retina (2x).
      height={160}
      quality={100}
      style={inverted ? { filter: "brightness(0) invert(1)" } : undefined}
      className={cn("h-7 w-auto", className)}
      priority
    />
  )
}
