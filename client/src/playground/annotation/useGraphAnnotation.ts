import { onMounted, ref } from "vue";
import type { Coordinate } from "@shape/types";
import { getCtx } from "@utils/ctx";
import type {
  Action,
  AnnotationOptions,
  DrawAction,
  EraseAction,
} from './types'
import { ANNOTATION_DEFAULTS } from './types'
import type { Graph } from "@graph/types";
import type { GraphMouseEvent } from "@graph/compositions/useBaseGraph/types";

export const useGraphAnnotation = (
  graph: Graph,
  options: AnnotationOptions = {}
) => {

  const annotationCanvas = ref<HTMLCanvasElement>()

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

  const isActive = ref(false)

  const clear = () => {
    const ctx = getCtx(annotationCanvas);
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

  const draw = (ctx: CanvasRenderingContext2D) => {
    const draw = actionDraw(ctx);
    const erase = actionErase(ctx);

    for (const action of actions.value) {
      action.type === "draw" ? draw(action) : erase(action);
    }
  };

  /**
   * starts drawing from the current mouse position
   */
  const startDrawing = ({ coords }: GraphMouseEvent) => {
    const ctx = getCtx(annotationCanvas);
    isDrawing.value = true;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    lastPoint.value = coords;
    batch.value = [{ ...coords }];
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
  const drawLine = ({ coords }: GraphMouseEvent) => {
    if (!isDrawing.value || !lastPoint.value) return;
    const ctx = getCtx(graph.canvas);

    const options = { ctx, at: coords };
    erasing.value ? actionEraseLine(options) : actionDrawLine(options);

    lastPoint.value = coords;
    batch.value.push({ ...coords });
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

  const activate = () => {
    if (!annotationCanvas.value) return;
    isActive.value = true;
    graph.subscribe('onMouseDown', startDrawing)
    graph.subscribe('onMouseMove', drawLine)
    graph.subscribe('onMouseUp', stopDrawing)

    annotationCanvas.value.style.display = ''
  };

  const deactivate = () => {
    if (!annotationCanvas.value) return;
    isActive.value = false;
    graph.unsubscribe('onMouseDown', startDrawing)
    graph.unsubscribe('onMouseMove', drawLine)
    graph.unsubscribe('onMouseUp', stopDrawing)

    annotationCanvas.value.style.display = 'none'
  };

  onMounted(() => {
    const canvas = document.getElementById('annotation-canvas')
    if (!canvas) throw new Error('annotation canvas not found')
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('annotation canvas is not a canvas element')
    annotationCanvas.value = canvas
  });

  return {
    selectedColor,
    selectedBrushWeight,
    erasing,
    clear,
    isDrawing,
    draw,

    isActive,
    activate,
    deactivate,
  };
};

export type AnnotationControls = ReturnType<typeof useGraphAnnotation>;
