import { onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { getCtx } from '@utils/ctx';

export const useStorePanZoomState = (
  canvasRef: Ref<HTMLCanvasElement | undefined | null>,
) => {
  const scale = useLocalStorage('pan-zoom-scale', 0);
  const panX = useLocalStorage('pan-zoom-pan-x', 0);
  const panY = useLocalStorage('pan-zoom-pan-y', 0);

  /**
   * tracks the current pan and zoom of the canvas
   */
  const track = () => {
    const ctx = getCtx(canvasRef);
    const { a, e, f } = ctx.getTransform();
    scale.value = a;
    panX.value = e;
    panY.value = f;
  };

  /**
   * applies the current pan and zoom to the canvas
   */
  const apply = () => {
    const ctx = getCtx(canvasRef);
    // console.log("applying", scale.value, panX.value, panY.value)
    // ctx.resetTransform();
    // ctx.translate(panX.value, panY.value);
    // ctx.scale(scale.value, scale.value);
  };

  onMounted(() => {
    if (!canvasRef.value) return;
    canvasRef.value.addEventListener('wheel', track);
    canvasRef.value.addEventListener('mousedown', track);
    canvasRef.value.addEventListener('mouseup', track);
    setTimeout(() => apply(), 0);
  });

  onUnmounted(() => {
    if (!canvasRef.value) return;
    canvasRef.value.removeEventListener('wheel', track);
    canvasRef.value.removeEventListener('mousedown', track);
    canvasRef.value.removeEventListener('mouseup', track);
  });

  return {
    track,
    apply,

    scale,
    panX,
    panY,
  };
};
