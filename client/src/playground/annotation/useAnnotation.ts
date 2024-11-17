import { onMounted, onBeforeUnmount, ref } from "vue";
import type { Ref } from "vue";
import type { Coordinate } from "@shape/types";
import { getCtx } from "@utils/ctx";

type AnnotationOptions = Partial<{
  color: string;
  brushWeight: number;
}>;

const ANNOTATION_DEFAULTS = {
  color: "red",
  brushWeight: 3,
};

export const useAnnotation = (
  canvas: Ref<HTMLCanvasElement | null | undefined>,
  options?: AnnotationOptions
) => {
  const { color, brushWeight } = {
    ...ANNOTATION_DEFAULTS,
    ...options,
  };

  const selectedColor = ref(color);
  const selectedBrushWeight = ref(brushWeight);
  const isDrawing = ref(false);
  const lastPoint = ref<Coordinate | null>(null);
  const batch = ref<Coordinate[]>([]);
  const actions = ref<{ color: string; brushWeight: number; points: Coordinate[] }[]>([]);
  const isEraserMode = ref(false); 

  const setColor = (color: string) => {
    selectedColor.value = color;
    isEraserMode.value = false; 
  };

  const setBrushWeight = (brushWeight: number) => {
    selectedBrushWeight.value = brushWeight;
  };

  const setEraser = () => {
    isEraserMode.value = true;
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
      ctx.strokeStyle = action.color;
      ctx.lineWidth = action.brushWeight + 1; // Not sure why this is required, something with smoothing?
      ctx.beginPath();
      action.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
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
    ctx.lineTo(x, y);
    ctx.strokeStyle = selectedColor.value;
    ctx.lineWidth = selectedBrushWeight.value;
    ctx.stroke();

    lastPoint.value = { x, y };
    batch.value.push({ x, y });
  };

  const stopDrawing = () => {
    if (!isDrawing.value) return;

    isDrawing.value = false;

    if (batch.value.length > 0) {
      actions.value.push({
        color: selectedColor.value,
        brushWeight: selectedBrushWeight.value,
        points: [...batch.value],
      });
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
