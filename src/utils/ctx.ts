import type { MaybeRef } from "vue";

/**
 * pulls ctx from a canvas, throws if not found
 *
 * @returns {CanvasRenderingContext2D}
 */
export const getCtx = (canvasInput: MaybeRef<HTMLCanvasElement | null | undefined>) => {
  if (!canvasInput) throw new Error("canvas not found");
  const canvas = 'value' in canvasInput ? canvasInput.value : canvasInput;
  if (!canvas) throw new Error("canvas not found");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context not found");
  return ctx;
};