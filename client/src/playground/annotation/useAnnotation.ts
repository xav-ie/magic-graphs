import { onMounted, onBeforeUnmount, ref } from "vue";
import type { Ref } from "vue";
import type { Coordinate } from "@shape/types";
import { getCtx } from "@utils/ctx";
import type { AnnotationOptions } from "./types";
import { scribble } from "@shapes";
import {
  ERASER_BRUSH_WEIGHT,
  SCRIBBLE_DEFAULTS as ANNOTATION_DEFAULTS,
  type Scribble,
} from "@shape/scribble";

export const useAnnotation = (
  canvas: Ref<HTMLCanvasElement | null | undefined>,
  options?: Partial<AnnotationOptions>
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
  const scribbles = ref<Scribble[]>([]);

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
    scribbles.value = [];
  };

  const draw = () => {
    const ctx = getCtx(canvas);
    if (!ctx) {
      console.error("Canvas context not found");
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    scribbles.value.forEach((action) => {
      scribble(action).draw(ctx);
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
      const steps = Math.ceil(distance / ERASER_BRUSH_WEIGHT);

      for (let i = 0; i <= steps; i++) {
        const interpolatedX =
          lastPoint.value.x + (i / steps) * (x - lastPoint.value.x);
        const interpolatedY =
          lastPoint.value.y + (i / steps) * (y - lastPoint.value.y);
        ctx.beginPath();
        ctx.arc(
          interpolatedX,
          interpolatedY,
          ERASER_BRUSH_WEIGHT,
          0,
          Math.PI * 2
        );
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
        scribbles.value.push({
          type: "erase",
          color: "",
          brushWeight: ERASER_BRUSH_WEIGHT,
          points: [...batch.value],
        });
      } else {
        scribbles.value.push({
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
