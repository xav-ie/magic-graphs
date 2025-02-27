import { onMounted, onBeforeUnmount, ref } from "vue";
import type { Ref } from "vue";
import type { Coordinate } from "@shape/types";
import { getCtx } from "@utils/ctx";
import type { Action, AnnotationOptions } from './types'
import { ANNOTATION_DEFAULTS } from './types'

export const useAnnotation = (
  canvas: Ref<HTMLCanvasElement | null | undefined>,
  options?: AnnotationOptions
) => {
  const { color, brushWeight, eraserBrushWeight } = {
    ...ANNOTATION_DEFAULTS,
    ...options,
  };

  const selectedColor = ref(color);
  const selectedBrushWeight = ref(brushWeight);
  const isDrawing = ref(false);
  const lastPoint = ref<Coordinate | null>(null);
  const batch = ref<Coordinate[]>([]);
  const actions = ref<Action[]>([]);

  const setColor = (color: string) => {
    selectedColor.value = color;
  };

  const setBrushWeight = (brushWeight: number) => {
    selectedBrushWeight.value = brushWeight;
  };

  const setEraser = () => {
    selectedColor.value = "";
  };

  const clear = () => {
    const ctx = getCtx(canvas);
    if (!ctx) {
      console.error("Canvas context not found");
      return;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    actions.value = [];
  };

  const draw = () => {
    const ctx = getCtx(canvas);
    if (!ctx) {
      console.error("Canvas context not found");
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    actions.value.forEach((action) => {
      if (action.type === "draw") {
        ctx.strokeStyle = action.color;
        ctx.lineWidth = action.brushWeight;
        ctx.beginPath();
        action.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (action.type === "erase") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = eraserBrushWeight;

        for (let i = 0; i < action.points.length - 1; i++) {
          const start = action.points[i];
          const end = action.points[i + 1];
          const distance = Math.sqrt(
            Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
          );
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
    });
  };

  const startDrawing = (event: MouseEvent) => {
    if (!canvas.value) return;

    const ctx = getCtx(canvas);
    if (!ctx) return;

    isDrawing.value = true;

    const { x, y } = getCanvasCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(x, y);

    lastPoint.value = { x, y };
    batch.value = [{ x, y }];
  };

  const drawLine = (event: MouseEvent) => {
    if (!isDrawing.value || !canvas.value || !lastPoint.value) return;

    const ctx = getCtx(canvas);
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(event);

    if (selectedColor.value === "") {
      ctx.globalCompositeOperation = "destination-out";
      const distance = Math.sqrt(
        Math.pow(x - lastPoint.value.x, 2) + Math.pow(y - lastPoint.value.y, 2)
      );
      const steps = Math.ceil(distance / eraserBrushWeight);

      for (let i = 0; i <= steps; i++) {
        const interpolatedX =
          lastPoint.value.x + (i / steps) * (x - lastPoint.value.x);
        const interpolatedY =
          lastPoint.value.y + (i / steps) * (y - lastPoint.value.y);
        ctx.beginPath();
        ctx.arc(interpolatedX, interpolatedY, eraserBrushWeight, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.lineTo(x, y);
      ctx.strokeStyle = selectedColor.value;
      ctx.lineWidth = selectedBrushWeight.value;
      ctx.stroke();
    }

    lastPoint.value = { x, y };
    batch.value.push({ x, y });
  };

  const stopDrawing = () => {
    if (!isDrawing.value) return;

    isDrawing.value = false;

    if (batch.value.length > 0) {
      if (selectedColor.value === "") {
        actions.value.push({
          type: "erase",
          color: "",
          brushWeight: eraserBrushWeight,
          points: [...batch.value],
        });
      } else {
        actions.value.push({
          type: "draw",
          color: selectedColor.value,
          brushWeight: selectedBrushWeight.value,
          points: [...batch.value],
        });
      }
    }

    lastPoint.value = null;
    batch.value = [];
  };

  const getCanvasCoordinates = (event: MouseEvent) => {
    if (!canvas.value) return { x: 0, y: 0 };
    const rect = canvas.value.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const addEventListeners = () => {
    if (!canvas.value) return;

    canvas.value.addEventListener("mousedown", startDrawing);
    canvas.value.addEventListener("mousemove", drawLine);
    canvas.value.addEventListener("mouseup", stopDrawing);
    window.addEventListener("resize", draw);
    window.addEventListener("keyup", handleKeyUp);
  };

  const removeEventListeners = () => {
    if (!canvas.value) return;

    canvas.value.removeEventListener("mousedown", startDrawing);
    canvas.value.removeEventListener("mousemove", drawLine);
    canvas.value.removeEventListener("mouseup", stopDrawing);
    window.removeEventListener("resize", draw);
    window.removeEventListener("keyup", handleKeyUp);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      draw();
    }
  };

  onMounted(addEventListeners);
  onBeforeUnmount(removeEventListeners);

  return {
    selectedColor,
    setColor,
    setEraser,
    clear,
    setBrushWeight,
    isDrawing,
    draw,
  };
};
