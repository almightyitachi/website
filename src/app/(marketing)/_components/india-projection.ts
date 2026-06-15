// Shared projection constants for the India talent map. The bbox here
// matches what generate_india_silhouette.py emits, so any consumer that
// projects (lng, lat) into screen-percent stays aligned with the
// silhouette asset and the bubble positions.

export const MAP_MINX = 68.0935
export const MAP_MAXX = 97.4115
export const MAP_MINY = 6.7544
export const MAP_MAXY = 37.0775

export function project(lng: number, lat: number): { left: number; top: number } {
  return {
    left: ((lng - MAP_MINX) / (MAP_MAXX - MAP_MINX)) * 100,
    top: ((MAP_MAXY - lat) / (MAP_MAXY - MAP_MINY)) * 100,
  }
}
