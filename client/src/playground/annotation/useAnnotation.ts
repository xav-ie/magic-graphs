import { onMounted, onBeforeUnmount, ref } from "vue";
import type { Ref } from "vue";
import type { Scribble } from "@shape/scribble";
import type { Coordinate } from "@shape/types";
import { getCtx } from "@utils/ctx";
import { scribble } from "@shapes";
import type { AnnotationOptions } from './types'
import { ANNOTATION_DEFAULTS } from './types'

export const useAnnotation = (
  canvas: Ref<HTMLCanvasElement | null | undefined>,
  options: AnnotationOptions = {}
) => {
  const { color, brushWeight, eraserBrushWeight } = {
    ...ANNOTATION_DEFAULTS,
    ...options,
  };

  const selectedColor = ref(color);
  const selectedBrushWeight = ref(brushWeight);

  const erasing = ref(false);

  const isDrawing = ref(false);
  const lastPoint = ref<Coordinate>();
  const batch = ref<Coordinate[]>([]);
  const scribbles = ref<Scribble[]>([]);

  const clear = () => {
    const ctx = getCtx(canvas);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    scribbles.value = [];
  };

  

  const draw = () => {
    const ctx = getCtx(canvas);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const action of scribbles.value) {
      scribble(action).draw(ctx)
    }
  };

  /**
   * starts drawing a line from the current mouse position
   */
  const startDrawing = (event: MouseEvent) => {
    const ctx = getCtx(canvas);

    isDrawing.value = true;

    const { offsetX: x, offsetY: y } = event;
    ctx.beginPath();
    ctx.moveTo(x, y);

    lastPoint.value = { x, y };
    batch.value = [{ x, y }];
  };

  const actionEraseLine = ({ ctx, at: { x, y } }: {
    ctx: CanvasRenderingContext2D;
    at: Coordinate;
  }) => {
    if (!lastPoint.value) return;
    const { x: lastX, y: lastY } = lastPoint.value;

    ctx.globalCompositeOperation = "destination-out";

    const squaredDistance = Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2);
    const distance = Math.sqrt(squaredDistance);
    const steps = Math.ceil(distance / eraserBrushWeight);

    for (let i = 0; i <= steps; i++) {
      const interpolatedX = lastX + (i / steps) * (x - lastX);
      const interpolatedY = lastY + (i / steps) * (y - lastY);

      ctx.beginPath();
      ctx.arc(interpolatedX, interpolatedY, eraserBrushWeight, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }

  const actionDrawLine = ({ ctx, at: { x, y } }: { ctx: CanvasRenderingContext2D, at: Coordinate }) => {
    ctx.lineTo(x, y);
    ctx.strokeStyle = selectedColor.value;
    ctx.lineWidth = selectedBrushWeight.value;
    ctx.stroke();
  }

  /**
   * draws a line that connects two points.
   * the delta between two mouse points while
   * mouse is being dragged
   */
  const drawLine = (event: MouseEvent) => {
    if (!isDrawing.value || !lastPoint.value) return;

    const ctx = getCtx(canvas);

    const { offsetX: x, offsetY: y } = event;

    const options = { ctx, at: { x, y } };
    erasing.value ? actionEraseLine(options) : actionDrawLine(options);

    lastPoint.value = { x, y };
    batch.value.push({ x, y });
  };

  const stopDrawing = () => {
    if (!isDrawing.value) return;

    isDrawing.value = false;
    lastPoint.value = undefined;

    if (batch.value.length === 0) return;

    const drawAction = {
      type: "draw",
      color: selectedColor.value,
      brushWeight: selectedBrushWeight.value,
      points: batch.value,
    } as const;

    const eraseAction = {
      type: "erase",
      brushWeight: eraserBrushWeight,
      points: batch.value,
    } as const;

    const action = erasing.value ? eraseAction : drawAction;
    scribbles.value.push(action);

    batch.value = [];
  };

  const addEventListeners = () => {
    if (!canvas.value) return;

    canvas.value.addEventListener("mousedown", startDrawing);
    canvas.value.addEventListener("mousemove", drawLine);
    canvas.value.addEventListener("mouseup", stopDrawing);
    window.addEventListener("resize", draw);
  };

  const removeEventListeners = () => {
    if (!canvas.value) return;

    canvas.value.removeEventListener("mousedown", startDrawing);
    canvas.value.removeEventListener("mousemove", drawLine);
    canvas.value.removeEventListener("mouseup", stopDrawing);
    window.removeEventListener("resize", draw);
  };

  onMounted(addEventListeners);
  onBeforeUnmount(removeEventListeners);

  return {
    selectedColor,
    selectedBrushWeight,
    erasing,
    clear,
    isDrawing,
    draw,
  };
};

export type AnnotationControls = ReturnType<typeof useAnnotation>;
