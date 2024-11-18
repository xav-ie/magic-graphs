import { SCRIBBLE_DEFAULTS, ERASER_BRUSH_WEIGHT } from ".";
import type { Scribble } from ".";

export const drawScribbleWithCtx = (scribble: Scribble) => (ctx: CanvasRenderingContext2D) => {
  
  const {
    color,
    brushWeight,
  } = {
    ...SCRIBBLE_DEFAULTS,
    ...scribble
  }

  if (scribble.type === "draw") {
    ctx.strokeStyle = color;
    ctx.lineWidth = brushWeight;
    ctx.beginPath();
    scribble.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.stroke();

  } else if (scribble.type === "erase") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = ERASER_BRUSH_WEIGHT;

    for (let i = 0; i < scribble.points.length - 1; i++) {
      const start = scribble.points[i];
      const end = scribble.points[i + 1];
      const distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      const steps = Math.ceil(distance / ERASER_BRUSH_WEIGHT);

      for (let j = 0; j <= steps; j++) {
        const interpolatedX = start.x + (j / steps) * (end.x - start.x);
        const interpolatedY = start.y + (j / steps) * (end.y - start.y);

        ctx.beginPath();
        ctx.arc(interpolatedX, interpolatedY, ERASER_BRUSH_WEIGHT, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalCompositeOperation = "source-over";
  }
 
}