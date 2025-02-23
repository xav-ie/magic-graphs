import { LINE_DEFAULTS } from '.';
import type { Line } from '.';

export const drawLineWithCtx =
  (line: Line) => (ctx: CanvasRenderingContext2D) => {
    const { start, end, width, color, dash, gradientStops } = {
      ...LINE_DEFAULTS,
      ...line,
    };

    if (width === 0) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;

    if (gradientStops && gradientStops.length >= 2) {
      const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      gradientStops.forEach(({ offset, color }) => {
        gradient.addColorStop(offset, color);
      });
      ctx.strokeStyle = gradient;
    }

    ctx.setLineDash(dash);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };
