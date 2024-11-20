import { onMounted, onBeforeUnmount, ref } from "vue";
import type { Ref } from "vue";
import type { Coordinate } from "@shape/types";
import { getCtx } from "@utils/ctx";
import type { Action, AnnotationOptions, DrawAction, EraseAction } from './types'
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
  const actions = ref<Action[]>([]);

  const clear = () => {
    const ctx = getCtx(canvas);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    actions.value = [];
  };

  const actionDraw = (ctx: CanvasRenderingContext2D) => (action: DrawAction) => {
    ctx.strokeStyle = action.color;
    ctx.lineWidth = action.brushWeight;
    ctx.beginPath();
    const [first, ...rest] = action.points;
    ctx.moveTo(first.x, first.y);
    rest.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.stroke();
  }

  const actionErase = (ctx: CanvasRenderingContext2D) => (action: EraseAction) => {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = eraserBrushWeight;

    for (let i = 0; i < action.points.length - 1; i++) {
      const start = action.points[i];
      const end = action.points[i + 1];
      const squaredDistance = Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2);
      const distance = Math.sqrt(squaredDistance);
      const steps = Math.ceil(distance / eraserBrushWeight);

      for (let j = 0; j <= steps; j++) {
        const interpolatedX = start.x + (j / steps) * (end.x - start.x);
        const interpolatedY = start.y + (j / steps) * (end.y - start.y);

        ctx.beginPath();
        ctx.arc(interpolatedX, interpolatedY, eraserBrushWeight, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalCompositeOperation = "source-over";
  }

  const draw = () => {
    const ctx = getCtx(canvas);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const draw = actionDraw(ctx);
    const erase = actionErase(ctx);

    for (const action of actions.value) {
      action.type === "draw" ? draw(action) : erase(action);
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
    actions.value.push(action);

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
