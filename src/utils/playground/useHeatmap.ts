import { ref, watch } from "vue"
import type { Ref } from "vue"
import colors from "@colors"
import type { Coordinate, Shape } from "@shape/types"
import { circle } from "@shapes"
import type { Circle } from "@shape/circle"
import { getCtx } from "@utils/ctx"
import { debounce } from "@utils/debounce"

/**
 * the color when the point is not hitting any shape
 */
const MISS_COLOR = colors.GREEN_500

/**
 * the color when the point is hitting a shape, but not an embedded text area
 */
const HIT_COLOR = colors.RED_500

/**
 * the color when the point is hitting a text area of a shape
 */
const TEXT_HIT_COLOR = colors.YELLOW_500

/**
 * effortlessly figure out which parts of the canvas are being hit by shapes
 *
 * @param canvas the canvas element
 * @param drawItems the shapes being rendered on the canvas
 * @returns heatmap controls
 */
export const useHeatmap = (
  canvas: Ref<HTMLCanvasElement | null | undefined>,
  drawItems: Ref<Shape[]>
) => {
  const active = ref(false)
  const resolution = ref(4)

  const processPoint = (coords: Coordinate) => {
    const shapeHit = drawItems.value
      .findLast((item) => item.hitbox(coords))

    const textHit = drawItems.value
      .findLast((item) => item.textHitbox?.(coords))

    const circleSchema: Circle = {
      at: coords,
      radius: 2,
      color: MISS_COLOR,
    }

    if (textHit) circleSchema.color = TEXT_HIT_COLOR
    else if (shapeHit) circleSchema.color = HIT_COLOR

    const ctx = getCtx(canvas)
    circle(circleSchema).draw(ctx)
  }

  const run = () => {
    if (!canvas.value || !active.value) return
    const { width, height } = canvas.value.getBoundingClientRect();

    for (let i = 0; i < width; i += resolution.value) {
      for (let j = 0; j < height; j += resolution.value) {
        processPoint({ x: i, y: j })
      }
    }
  }
  watch(active, run)

  const debouncedRunner = debounce(run, 500)
  watch(resolution, debouncedRunner)
  watch(drawItems, debouncedRunner)

  return {
    heatmapActive: active,
    heatmapResolution: resolution,
    runHeatmap: run,
    runHeatmapDebounced: debouncedRunner,
  }
};