import { getCtx } from '@utils/ctx';
import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function usePinchToZoom(canvasRef: Ref<HTMLCanvasElement | undefined | null>) {
  const scale = ref(1); // Current zoom level
  const maxScale = 5; // Maximum zoom level
  const minScale = 0.5; // Minimum zoom level
  const origin = ref({ x: 0, y: 0 }); // Current origin for zoom

  const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault(); // Prevent scrolling
      const canvas = canvasRef.value;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const cursorX = event.clientX - rect.left; // Cursor position in canvas space
      const cursorY = event.clientY - rect.top;

      const scaleChange = event.deltaY < 0 ? 1.03 : 0.97; // Zoom in or out
      const newScale = Math.min(maxScale, Math.max(minScale, scale.value * scaleChange));

      // Adjust origin to keep the zoom centered around the cursor
      origin.value.x =
        cursorX - (cursorX - origin.value.x) * (newScale / scale.value);
      origin.value.y =
        cursorY - (cursorY - origin.value.y) * (newScale / scale.value);

      scale.value = newScale;
      applyZoom();
    }
  };

  const applyZoom = () => {
    const ctx = getCtx(canvasRef);
    ctx.resetTransform();
    ctx.translate(origin.value.x, origin.value.y);
    ctx.scale(scale.value, scale.value);
  };

  onMounted(() => {
    const canvas = canvasRef.value;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }
  });

  onUnmounted(() => {
    const canvas = canvasRef.value;
    if (canvas) {
      canvas.removeEventListener('wheel', handleWheel);
    }
  });

  return {
    scale,
    origin,
  };
}
