import { ref } from "vue"
import type { Ref } from "vue"
import type { Aggregator, UpdateAggregator } from "./types"
import type { BaseGraphEmitter } from "./events"

export type UseAggregatorOptions = {
  canvas: Ref<HTMLCanvasElement | null | undefined>
  emit: BaseGraphEmitter
}

export const useAggregator = ({ canvas, emit }: UseAggregatorOptions) => {
  const aggregator = ref<Aggregator>([])
  const updateAggregator: UpdateAggregator[] = []

  const repaint = (repaintId: string) => () => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    const evaluateAggregator = updateAggregator.reduce<Aggregator>((acc, fn) => fn(acc), [])
    aggregator.value = [...evaluateAggregator.sort((a, b) => a.priority - b.priority)]

    for (const item of aggregator.value) item.shape.draw(ctx)
    emit('onRepaint', ctx, repaintId)
  }

  const getSchemaItemsByCoordinates = (x: number, y: number) => {
    return aggregator.value
      .sort((a, b) => a.priority - b.priority)
      .filter(item => item.shape.hitbox({ x, y }) || item.shape.textHitbox?.({ x, y }))
  }

  return {
    aggregator,
    updateAggregator,
    repaint,
    getSchemaItemsByCoordinates,
  }
}