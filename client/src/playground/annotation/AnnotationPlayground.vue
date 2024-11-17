<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useDark, useWindowSize } from "@vueuse/core";
import ResponsiveCanvas from "@utils/components/ResponsiveCanvas.vue";
import colors from "@colors";
import { getCtx } from "@utils/ctx";

const canvas = ref<HTMLCanvasElement>();
const isDark = useDark();

const color = computed(() =>
  isDark.value ? colors.GRAY_800 : colors.GRAY_200
);

const patternColor = computed(
  () => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + "15"
);

const { width, height } = useWindowSize();

const selectedColor = ref("red"); 
const colorsList = ["red", "blue", "green", "yellow"];
let isDrawing = false;
let lastPoint: { x: number; y: number } | null = null;
let batch: { x: number; y: number }[] = [];
const actions: { color: string; points: { x: number; y: number }[] }[] = [];
let batchTimeout: NodeJS.Timeout | null = null;

const setColor = (color: string) => {
  selectedColor.value = color;
};

const draw = () => {
  const ctx = getCtx(canvas);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  actions.forEach(action => {
    ctx.strokeStyle = action.color;
    ctx.beginPath();
    action.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.lineWidth = 3
    ctx.stroke();
  });
};

const startDrawing = (event: MouseEvent) => {
  if (!canvas.value) return;

  const ctx = getCtx(canvas);
  isDrawing = true;
  ctx.strokeStyle = selectedColor.value;
  ctx.lineWidth = 2;

  const { x, y } = getCanvasCoordinates(event);
  ctx.beginPath();
  ctx.moveTo(x, y);
  lastPoint = { x, y };

  // Initialize a new batch for this drawing session
  batch = [{ x, y }];
};

const drawLine = (event: MouseEvent) => {
  if (!isDrawing || !canvas.value || !lastPoint) return;

  const ctx = getCtx(canvas);
  const { x, y } = getCanvasCoordinates(event);
  ctx.lineTo(x, y);
  ctx.stroke();
  lastPoint = { x, y };

  // Add points to the batch during the drawing session
  batch.push({ x, y });
};

const stopDrawing = () => {
  if (!isDrawing) return;
  isDrawing = false;

  // Save the current batch when the drawing session ends
  if (batch.length > 0) {
    actions.push({
      color: selectedColor.value,
      points: [...batch],
    });
  }

  lastPoint = null;
  batch = []; // Clear the batch
};


const getCanvasCoordinates = (event: MouseEvent) => {
  if (!canvas.value) return { x: 0, y: 0 };
  const rect = canvas.value.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

onMounted(() => {
  if (!canvas.value) return;

  const canvasElement = canvas.value;
  canvasElement.addEventListener("mousedown", startDrawing);
  canvasElement.addEventListener("mouseup", stopDrawing);
  canvasElement.addEventListener("mousemove", drawLine);
  document.addEventListener("resize", draw);
  document.addEventListener("keyup", (e) => {
    if (e.code === "Space") draw();
  });
});

onBeforeUnmount(() => {
  if (!canvas.value) return;

  const canvasElement = canvas.value;
  canvasElement.removeEventListener("mousedown", startDrawing);
  canvasElement.removeEventListener("mouseup", stopDrawing);
  canvasElement.removeEventListener("mousemove", drawLine);
  document.removeEventListener("resize", draw);
  document.removeEventListener("keyup", draw);
  
  if (batchTimeout) {
    clearTimeout(batchTimeout);
  }
});
</script>

<template>
  <div class="h-full w-full">
    <!-- Toolbar for color selection -->
    <div class="absolute m-3 flex gap-3 z-50">
      <button v-for="color in colorsList" :key="color"
        :style="{ backgroundColor: color, border: selectedColor === color ? '2px solid black' : '1px solid gray' }"
        @click="setColor(color)" class="w-8 h-8"></button>
    </div>

    <!-- Responsive Canvas -->
    <ResponsiveCanvas
      @canvas-ref="(el) => (canvas = el)"
      :color="color"
      :pattern-color="patternColor"
      :canvas-width="width"
      :canvas-height="height"
    ></ResponsiveCanvas>
  </div>
</template>
