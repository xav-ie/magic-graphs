<script setup lang="ts">
  import { ref, useAttrs, watch, computed, onUnmounted } from "vue";
  import { useElementSize } from "@vueuse/core";
  import { drawLineWithCtx } from "@shape/draw/line";
  import { debounce } from "@utils/debounce";
  import { type Color } from "@colors";

  /**
   * how many multiples larger the graph is relative to the size of the parents
   * height and width.
   *
   * IE if the width and height of the parent is the full viewport and OPEN_WORLD_FACTOR = 3,
   * the canvas will take up 3*3=9 viewports in surface area
   */
  const OPEN_WORLD_FACTOR = 2;

  const canvasWidth = ref(0);
  const canvasHeight = ref(0);

  const loading = ref(true);

  const bgCanvas = ref<HTMLCanvasElement>();

  const props = defineProps<{
    color: Color;
    patternColor: Color;
  }>();

  const emit = defineEmits<{
    (e: "canvasRef", value: HTMLCanvasElement | undefined): void;
    (e: "widthChange", value: number): void;
    (e: "heightChange", value: number): void;
  }>();

  const DEFAULT_PARENT_CLASSES = ["w-full", "h-full"];

  /**
   * intercepts the class html prop to allow for custom class handling
   */
  const { class: classAttr } = useAttrs();

  const parentClasses = computed<string | string[]>(() => {
    if (!classAttr) return DEFAULT_PARENT_CLASSES;
    else if (Array.isArray(classAttr)) return classAttr;
    else if (typeof classAttr === "string") return classAttr;
    else throw new Error("invalid class attribute");
  });

  const emitRef = (el: HTMLCanvasElement | undefined) => emit("canvasRef", el);

  const parentEl = ref<HTMLDivElement>();
  const { height: parentWidth, width: parentHeight } = useElementSize(parentEl);

  const setCanvasSize = async () => {
    const parentEl = await getParentEl();
    const { width, height } = parentEl.getBoundingClientRect();
    canvasWidth.value = width * OPEN_WORLD_FACTOR;
    canvasHeight.value = height * OPEN_WORLD_FACTOR;
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
    new Promise<CanvasRenderingContext2D>((resolve, reject) => {
      const interval = setInterval(() => {
        if (bgCanvas.value) {
          const ctx = bgCanvas.value.getContext("2d");
          clearInterval(interval);
          ctx ? resolve(ctx) : reject("2d context not found");
        }
      }, 100);
    });

  const drawBackgroundPattern = debounce(async () => {
    const ctx = await getBgCanvasContext();

    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

    const SAMPLING_RATE = 75;

    for (let x = SAMPLING_RATE / 2; x < canvasWidth.value; x += SAMPLING_RATE) {
      for (
        let y = SAMPLING_RATE / 2;
        y < canvasHeight.value;
        y += SAMPLING_RATE
      ) {
        const len = 10;
        const width = 2;
        const start = { x, y };
        const end = { x: x, y: y + len };
        drawLineWithCtx(ctx)({
          start,
          end,
          color: props.patternColor,
          width,
        });

        const start2 = { x: x - len / 2, y: y + len / 2 };
        const end2 = { x: x + len / 2, y: y + len / 2 };

        drawLineWithCtx(ctx)({
          start: start2,
          end: end2,
          color: props.patternColor,
          width,
        });
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

    parentEl.addEventListener("scroll", updatePositionCoords);
    loading.value = false;
  };

  setTimeout(initCanvas, 100);

  const xCoord = ref(0);
  const yCoord = ref(0);

  const updatePositionCoords = async () => {
    const parentEl = await getParentEl();

    const { scrollLeft, scrollTop, clientHeight, clientWidth } = parentEl;

    const x = scrollLeft - canvasWidth.value / 2 + clientWidth / 2;
    const y = scrollTop - canvasHeight.value / 2 + clientHeight / 2;

    xCoord.value = x;
    yCoord.value = y * -1; // flip axis to get a standard cartesian plane
  };

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

  watch(() => props.patternColor, drawBackgroundPattern);

  onUnmounted(async () => {
    const parentEl = await getParentEl();
    parentEl.removeEventListener("scroll", updatePositionCoords);
  });
</script>

<template>
  <!-- coordinates for debugging -->
  <p
    class="z-50 dark:text-white text-lg absolute top-0 right-0 mt-2 mr-6 select-none"
  >
    ({{ xCoord }}, {{ yCoord }})
  </p>

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
