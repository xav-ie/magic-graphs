<script setup lang="ts">
  import { ref, watch, computed } from "vue";
  import { useElementSize } from "@vueuse/core";
  import { debounce } from "@utils/debounce";
  import { useClassAttrs } from "@ui/useClassAttrs";
  import { cross } from "@shapes";
  import type { Color } from "@colors";
  import { getCtx } from "@utils/ctx";
  import CoordinateIndicator from "./CoordinateIndicator.vue";
import { useCanvasCoords } from "./useCanvasCoord";

  const canvasWidth = ref(0);
  const canvasHeight = ref(0);

  const loading = ref(true);

  const bgCanvas = ref<HTMLCanvasElement>();

  const props = defineProps<{
    color: Color;
    patternColor: Color;
    /**
     * @default 2500
     */
    canvasWidth?: number;
    /**
     * @default 2500
     */
    canvasHeight?: number;
  }>();

  const widthProp = computed(() => props?.canvasWidth ?? 2500);
  const heightProp = computed(() => props?.canvasHeight ?? 2500);

  const emit = defineEmits<{
    (e: "canvasRef", value: HTMLCanvasElement | undefined): void;
    (e: "widthChange", value: number): void;
    (e: "heightChange", value: number): void;
  }>();

  const DEFAULT_PARENT_CLASSES = ["w-full", "h-full"];

  const parentClasses = useClassAttrs();

  const emitRef = (el: HTMLCanvasElement | undefined) => emit("canvasRef", el);

  const parentEl = ref<HTMLDivElement>();
  const { height: parentWidth, width: parentHeight } = useElementSize(parentEl);

  const setCanvasSize = async () => {
    canvasWidth.value = widthProp.value;
    canvasHeight.value = heightProp.value;
  };

  const getParentEl = async () => {
    if (parentEl.value) return parentEl.value;
    return new Promise<HTMLDivElement>((resolve) => {
      const interval = setInterval(() => {
        if (parentEl.value) {
          clearInterval(interval);
          resolve(parentEl.value);
        }
      }, 100);
    });
  };

  const getBgCanvasContext = async () =>
    new Promise<CanvasRenderingContext2D>((res) => {
      const interval = setInterval(() => {
        if (!bgCanvas.value) return;
        res(getCtx(bgCanvas.value));
        clearInterval(interval);
      }, 100);
    });

  const drawBackgroundPattern = debounce(async () => {
    const ctx = await getBgCanvasContext();

    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

    const RATE = 75;

    for (let x = RATE / 2; x < canvasWidth.value; x += RATE) {
      for (let y = RATE / 2; y < canvasHeight.value; y += RATE) {
        cross({
          at: { x, y },
          size: 2,
          color: props.patternColor,
        }).draw(ctx);
      }
    }
  }, 250);

  const initCanvas = async () => {
    drawBackgroundPattern();
    const parentEl = await getParentEl();

    const middleY = canvasHeight.value / 2 - parentEl.clientHeight / 2;
    parentEl.scrollTop = middleY;

    const middleX = canvasWidth.value / 2 - parentEl.clientWidth / 2;
    parentEl.scrollLeft = middleX;

    loading.value = false;
  };

  setTimeout(initCanvas, 100);

  watch(parentWidth, () => {
    setCanvasSize();
    drawBackgroundPattern();
    emit("widthChange", canvasWidth.value);
  });

  watch(parentHeight, () => {
    setCanvasSize();
    drawBackgroundPattern();
    emit("heightChange", canvasHeight.value);
  });

  watch([widthProp, heightProp], () => {
    setCanvasSize();
    drawBackgroundPattern();
    emit("widthChange", canvasWidth.value);
    emit("heightChange", canvasHeight.value);
  });

  watch(() => props.patternColor, drawBackgroundPattern);

  const coords = useCanvasCoords({
    canvasWidth,
    canvasHeight,
    getParentEl,
  });
</script>

<template>
  <CoordinateIndicator :coords="coords" />
  <div
    ref="parentEl"
    class="h-full w-full overflow-auto relative"
    id="responsive-canvas-container"
  >
    <div
      v-if="loading"
      :style="{ backgroundColor: color }"
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center"
    ></div>

    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      :ref="(emitRef as any)"
      :class="[`w-[${canvasWidth}px]`, `h-[${canvasHeight}px]`]"
      id="responsive-canvas"
    ></canvas>

    <canvas
      ref="bgCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      :class="[
        `bg-[${color}]`,
        `w-[${canvasWidth}px]`,
        `h-[${canvasHeight}px]`,
        'absolute',
        'top-0',
        '-z-10',
        'pointer-events-none',
      ]"
    ></canvas>
  </div>
</template>
