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

  const loadingGraph = ref(true);

  const bgCanvas = ref<HTMLCanvasElement>();

  const props = defineProps<{
    color: Color;
    patternColor: Color;
  }>();

  const emit = defineEmits<{
    (e: "graphRef", value: HTMLCanvasElement | undefined): void;
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

  const emitRef = (el: HTMLCanvasElement | undefined) => emit("graphRef", el);

  const parentEl = ref<HTMLDivElement>();
  const { height: parentWidth, width: parentHeight } = useElementSize(parentEl);

  const setCanvasSize = () => {
    const { width, height } = getParentEl().getBoundingClientRect();
    canvasWidth.value = width * OPEN_WORLD_FACTOR;
    canvasHeight.value = height * OPEN_WORLD_FACTOR;
  };

  const getParentEl = () => {
    if (!parentEl.value) throw new Error("parent element not found");
    return parentEl.value;
  };

  const getBgCanvasContext = () => {
    if (!bgCanvas.value) throw new Error("bgCanvas not found");
    const ctx = bgCanvas.value.getContext("2d");
    if (!ctx) throw new Error("2d context not found");
    return ctx;
  };

  const drawBackgroundPattern = debounce(() => {
    const ctx = getBgCanvasContext();

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

  const initCanvas = () => {
    drawBackgroundPattern();
    const parentEl = getParentEl();

    const middleY = canvasHeight.value / 2 - parentEl.clientHeight / 2;
    parentEl.scrollTop = middleY;

    const middleX = canvasWidth.value / 2 - parentEl.clientWidth / 2;
    parentEl.scrollLeft = middleX;

    parentEl.addEventListener("scroll", updatePositionCoords);
    loadingGraph.value = false;
  };

  setTimeout(initCanvas, 100);

  const xCoord = ref(0);
  const yCoord = ref(0);

  const updatePositionCoords = () => {
    const parentEl = getParentEl();

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

  onUnmounted(() => {
    getParentEl().removeEventListener("scroll", updatePositionCoords);
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
    id="graph-container"
    class="h-full w-full overflow-auto relative"
  >
    <div
      v-if="loadingGraph"
      :style="{ backgroundColor: color }"
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center"
    ></div>

    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      :ref="(emitRef as any)"
      :class="[`w-[${canvasWidth}px]`, `h-[${canvasHeight}px]`]"
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
