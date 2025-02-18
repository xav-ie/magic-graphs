import { ref, onMounted, onUnmounted } from "vue";
import type { Coordinate } from "@shape/types";

export const useCanvasCamera = () => {
  const allowPanning = ref(true);

  const isPanning = ref(false);
  const panStart = ref<Coordinate>({ x: 0, y: 0 });
  const scrollStart = ref<Coordinate>({ x: 0, y: 0 });
  const parentEl = ref<HTMLElement | null>(null);

  const startPan = (event: MouseEvent) => {
    if (!allowPanning.value) return;
    if (!parentEl.value) return;

    if (event.button !== 2) return;

    console.log("hi");
    event.preventDefault();
    isPanning.value = true;
    panStart.value = { x: event.clientX, y: event.clientY };
    scrollStart.value = {
      x: parentEl.value.scrollLeft,
      y: parentEl.value.scrollTop,
    };
  };

  const pan = (event: MouseEvent) => {
    if (!isPanning.value || !parentEl.value) return;
    const dx = panStart.value.x - event.clientX;
    const dy = panStart.value.y - event.clientY;
    parentEl.value.scrollLeft = scrollStart.value.x + dx;
    parentEl.value.scrollTop = scrollStart.value.y + dy;
  };

  const stopPan = () => {
    isPanning.value = false;
  };

  const teleportTo = (coords: Coordinate) => {
    if (parentEl.value) {
      parentEl.value.scrollTo({
        left: coords.x,
        top: coords.y,
        behavior: "smooth",
      });
    }
  };

  onMounted(() => {
    parentEl.value = document.getElementById("responsive-canvas-container");
    if (parentEl.value) {
      parentEl.value.addEventListener("mousedown", startPan);
      parentEl.value.addEventListener("mousemove", pan);
      parentEl.value.addEventListener("mouseup", stopPan);
      parentEl.value.addEventListener("mouseleave", stopPan);
      parentEl.value.addEventListener("contextmenu", (event) =>
        event.preventDefault(),
      );
    }
  });

  onUnmounted(() => {
    if (parentEl.value) {
      parentEl.value.removeEventListener("mousedown", startPan);
      parentEl.value.removeEventListener("mousemove", pan);
      parentEl.value.removeEventListener("mouseup", stopPan);
      parentEl.value.removeEventListener("mouseleave", stopPan);
      parentEl.value.removeEventListener("contextmenu", (event) =>
        event.preventDefault(),
      );
    }
  });

  return {
    allowPanning,
    isPanning,

    teleportTo,
  };
};
