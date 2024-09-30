import { toRef, watch, onMounted, type Ref } from 'vue'

type CircleOptions = {
  radius: number
  color: string
  x: number
  y: number
}

export const useCircle = (canvas: Ref<HTMLCanvasElement>, options: CircleOptions) => {
  const controls = toRef(options)

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath()
    ctx.arc(controls.value.x, controls.value.y, controls.value.radius, 0, Math.PI * 2)
    ctx.fillStyle = controls.value.color
    ctx.fill()
    ctx.closePath()
  }

  onMounted(() => {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      draw(ctx)
    }
  })

  watch(controls, () => {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      draw(ctx)
    }
  }, { deep: true })

  return controls
}