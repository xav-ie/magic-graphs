/*
  This file contains helper functions for drawing shapes on the canvas.
*/

type Coordinate = {
  x: number,
  y: number,
}

type Text = {
  content: string,
  fontSize: number,
  fontWeight: 'lighter' | 'normal' | 'bold' | 'bolder',
  color: string,
}

type Stroke = {
  color: string,
  width: number,
}

type CircleOptions = {
  at: Coordinate,
  radius: number,
  color: string,
  stroke?: Stroke,
  text?: Text
}

type LineOptions = {
  start: Coordinate,
  end: Coordinate,
  color: string,
  width: number,
}

export const drawCircleWithCtx = (ctx: CanvasRenderingContext2D) => (options: CircleOptions) => {
  const { at, radius, color } = options;
  ctx.beginPath();
  ctx.arc(at.x, at.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  if (options.stroke) {
    const { color, width } = options.stroke;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  if (options.text) {
    const { content, fontSize, fontWeight, color } = options.text;
    ctx.font = `${fontWeight} ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, at.x, at.y);
  }

  ctx.closePath();
}

export const drawLineWithCtx = (ctx: CanvasRenderingContext2D) => (options: LineOptions) => {
  const { start, end, color, width } = options;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.closePath();
}