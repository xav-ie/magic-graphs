<script setup lang="ts">
  import {
    ref,
    useAttrs,
    watch,
    computed,
    onMounted,
  } from "vue";
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
    if (Array.isArray(classAttr) || typeof classAttr === "string") return classAttr;
    throw new Error("invalid class attribute");
  })

  const emitRef = (el: HTMLCanvasElement | undefined) => emit("graphRef", el);

  const parent = ref<HTMLDivElement | null>(null);
  const { height: parentWidth, width: parentHeight } = useElementSize(parent);

  const setCanvasSize = () => {
    if (!parent.value) return;
    const { width, height } = parent.value.getBoundingClientRect();
    canvasWidth.value = width || height;
    canvasHeight.value = height;
  };

  onMounted(() => {
    watch(parentHeight, setCanvasSize, { immediate: true });
    watch(parentWidth, setCanvasSize, { immediate: true });
  });
</script>

<template>
  <div
    ref="parent"
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
