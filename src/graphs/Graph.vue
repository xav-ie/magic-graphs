<script setup lang="ts">
  import { ref, useAttrs, watch, computed, onMounted, onUnmounted } from "vue";
  import type { WatchHandle } from "vue";
  import { useElementSize } from "@vueuse/core";
  import colors from "@utils/colors";
  import { drawLineWithCtx } from "@shape/draw/line";
  import type { Graph } from "@graph/types";
  import GraphSpinner from "./GraphSpinner.vue";

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
    graph: Graph;
  }>();

  const emit = defineEmits<{
    (e: "graphRef", value: HTMLCanvasElement | undefined): void;
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
    if (!parentEl.value) throw new Error("parent element not found");
    const { width, height } = parentEl.value.getBoundingClientRect();
    canvasWidth.value = width * OPEN_WORLD_FACTOR;
    canvasHeight.value = height * OPEN_WORLD_FACTOR;
  };

  let stopParentWidthWatch: WatchHandle;
  let stopParentHeightWatch: WatchHandle;

  onMounted(() => {
    stopParentWidthWatch = watch(parentHeight, () => {
      setCanvasSize();
      drawBackgroundPattern();
      props.graph.repaint('graph-view/width-watch')
    }, {
      immediate: true,
    });
    stopParentHeightWatch = watch(parentWidth, () =>{
      setCanvasSize();
      drawBackgroundPattern();
      props.graph.repaint('graph-view/height-watch')
    }, {
      immediate: true,
    });
  });

  const patternColor = ref(props.graph.getTheme('graphBgPatternColor'))

  props.graph.subscribe('onThemeChange', () => {
    const color = props.graph.getTheme('graphBgPatternColor')
    if (color === patternColor.value) return;
    patternColor.value = color;
    drawBackgroundPattern();
  })

  const drawBackgroundPattern = debounce(() => {

    if (!bgCanvas.value) throw new Error("bgCanvas not found");
    const ctx = bgCanvas.value.getContext("2d");
    if (!ctx) throw new Error("2d context not found");

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
          color: patternColor.value,
          width,
        });

        const start2 = { x: x - len / 2, y: y + len / 2 };
        const end2 = { x: x + len / 2, y: y + len / 2 };

        drawLineWithCtx(ctx)({
          start: start2,
          end: end2,
          color: patternColor.value,
          width,
        });
      }
    }
  }, 250);

  setTimeout(() => {
    if (!bgCanvas.value) throw new Error("bgCanvas not found");
    const ctx = bgCanvas.value.getContext("2d");
    if (!ctx) throw new Error("2d context not found");
    drawBackgroundPattern();
    if (!parentEl.value) throw new Error("parent element not found");

    const middleY = canvasHeight.value / 2 - parentEl.value.clientHeight / 2;
    parentEl.value.scrollTop = middleY;

    const middleX = canvasWidth.value / 2 - parentEl.value.clientWidth / 2;
    parentEl.value.scrollLeft = middleX;

    parentEl.value.addEventListener("scroll", currentPosition);
    loadingGraph.value = false;
  }, 100);

  const xCoord = ref(0);
  const yCoord = ref(0);

  const currentPosition = () => {
    if (!parentEl.value) throw new Error("parent element not found");

    const x = parentEl.value.scrollLeft - (canvasWidth.value / 2) + (parentEl.value.clientWidth / 2);
    const y = parentEl.value.scrollTop - (canvasHeight.value / 2) + (parentEl.value.clientHeight / 2);
    xCoord.value = x
    yCoord.value = y * -1; // flip axis to get a normal cartesian plane
  };

  onUnmounted(() => {
    stopParentWidthWatch();
    stopParentHeightWatch();
    if (!parentEl.value) throw new Error("parent element not found");
    parentEl.value.removeEventListener("scroll", currentPosition);
  });

  const bgColor = computed(() => props.graph.getTheme("graphBgColor"));
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
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center"
      :style="{ backgroundColor: bgColor }"
    >
      <!-- <GraphSpinner /> -->
    </div>

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
        `bg-[${bgColor}]`,
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

<style scoped></style>
