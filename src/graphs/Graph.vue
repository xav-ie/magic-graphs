<script setup lang="ts">
  import { ref, useAttrs, watch, computed, onMounted, onUnmounted } from "vue";
  import type { WatchHandle } from "vue";
  import { useElementSize } from "@vueuse/core";

  const canvasWidth = ref(0);
  const canvasHeight = ref(0);

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
    canvasWidth.value = width;
    canvasHeight.value = height;
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

  onUnmounted(() => {
    stopParentWidthWatch();
    stopParentHeightWatch();
  });
</script>

<template>
  <div
    ref="parentEl"
    :class="parentClasses"
  >
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      :ref="(emitRef as any)"
      :class="[`w-[${canvasWidth}px]`, `h-[${canvasHeight}px]`]"
    ></canvas>
  </div>
</template>
