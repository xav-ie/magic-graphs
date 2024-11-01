import { ref } from "vue"
import type { MaybeRef, Ref } from "vue"
import colors from "@colors"
import type { Shape } from "@shape/types"

const MISS_COLOR = colors.GREEN_500
const HIT_COLOR = colors.RED_500
const TEXT_HIT_COLOR = colors.YELLOW_500

export const useHeatmap = (
  canvas: Ref<HTMLCanvasElement | null | undefined>,
  drawItems: MaybeRef<Shape[]>
) => {
  const active = ref(false)
  const resolution = ref(4)

  return {
    heatmapActive: active,
    heatmapResolution: resolution,
  }
}