<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import type { Coordinate } from "@shape/types";
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
const isDrawing = ref(false);
const lastPoint = ref<Coordinate | null>(null);
const batch = ref<Coordinate[]>([]);

type Actions = {
  color: string;
  points: Coordinate[];
};
const actions = ref<Actions[]>([]);

const setColor = (color: string) => {
  selectedColor.value = color;
};

const draw = () => {
  const ctx = getCtx(canvas);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  actions.value.forEach((action) => {
    ctx.strokeStyle = action.color;
    ctx.beginPath();
    action.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.lineWidth = 3;
    ctx.stroke();
  });
};

const startDrawing = (event: MouseEvent) => {
  if (!canvas.value) return;

  const ctx = getCtx(canvas);
  isDrawing.value = true;
  ctx.strokeStyle = selectedColor.value;
  ctx.lineWidth = 2;

  const { x, y } = getCanvasCoordinates(event);
  ctx.beginPath();
  ctx.moveTo(x, y);
  lastPoint.value = { x, y };

  batch.value = [{ x, y }];
};

const drawLine = (event: MouseEvent) => {
  if (!isDrawing.value || !canvas.value || !lastPoint.value) return;

  const ctx = getCtx(canvas);
  const { x, y } = getCanvasCoordinates(event);
  ctx.lineTo(x, y);
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
});
</script>

<template>
  <div class="h-full w-full">
    <div class="absolute m-3 flex gap-3 z-50">
      <button
        v-for="color in colorsList"
        :key="color"
        :style="{
          backgroundColor: color,
          border:
            selectedColor === color ? '2px solid black' : '1px solid gray',
        }"
        @click="setColor(color)"
        class="w-8 h-8"
      ></button>
    </div>

    <ResponsiveCanvas
      @canvas-ref="(el) => (canvas = el)"
      :color="color"
      :pattern-color="patternColor"
      :canvas-width="width"
      :canvas-height="height"
    ></ResponsiveCanvas>
  </div>
</template>
