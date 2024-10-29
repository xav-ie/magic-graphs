<script setup lang="ts">
  import { ref, useAttrs, watch, computed, onMounted, onUnmounted } from "vue";
  import type { WatchHandle } from "vue";
  import { useElementSize } from "@vueuse/core";
  import colors from "@utils/colors";
  import { drawLineWithCtx } from "@shape/draw/line";
  import type { Graph } from "@graph/types";

  const canvasWidth = ref(0);
  const canvasHeight = ref(0);

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
    canvasWidth.value = width * 3;
    canvasHeight.value = height * 3;
  };

  let stopParentWidthWatch: WatchHandle;
  let stopParentHeightWatch: WatchHandle;

  onMounted(() => {
    stopParentWidthWatch = watch(parentHeight, setCanvasSize, {
      immediate: true,
    });
    stopParentHeightWatch = watch(parentWidth, setCanvasSize, {
      immediate: true,
    });
  });

  setTimeout(() => {
    if (!bgCanvas.value) throw new Error("bgCanvas not found");
    const ctx = bgCanvas.value.getContext("2d");
    if (!ctx) throw new Error("2d context not found");

    const SAMPLING_RATE = 75;

    for (let x = SAMPLING_RATE / 2; x < canvasWidth.value; x += SAMPLING_RATE) {
      for (
        let y = SAMPLING_RATE / 2;
        y < canvasHeight.value;
        y += SAMPLING_RATE
      ) {
        const len = 10;
        const width = 2;
        const color = colors.WHITE + "10";
        const start = { x, y };
        const end = { x: x, y: y + len };
        drawLineWithCtx(ctx)({
          start,
          end,
          color,
          width,
        });

        const start2 = { x: x - len / 2, y: y + len / 2 };
        const end2 = { x: x + len / 2, y: y + len / 2 };

        drawLineWithCtx(ctx)({
          start: start2,
          end: end2,
          color,
          width,
        });
      }
    }
  }, 100);

  onUnmounted(() => {
    stopParentWidthWatch();
    stopParentHeightWatch();
  });

  const bgColor = computed(() => props.graph.getTheme("graphBgColor"));
</script>

<template>
  <div
    ref="parentEl"
    id="graph-container"
    class="h-full w-full overflow-auto relative"
  >
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

<style scoped>
/* hide the bars that show up when you scroll */
div.graph-container::-webkit-scrollbar {
  display: none;
}
</style>
