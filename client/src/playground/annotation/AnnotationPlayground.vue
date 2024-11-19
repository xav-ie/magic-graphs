<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useDark, useWindowSize } from "@vueuse/core";
  import ResponsiveCanvas from "@utils/components/ResponsiveCanvas.vue";
  import colors from "@colors";
  import { useAnnotation } from "./useAnnotation";
  import AnnotationControls from "./AnnotationControls.vue";

  const canvas = ref<HTMLCanvasElement>();
  const isDark = useDark();

  const {
    setBrushWeight,
    setColor,
    clear,
    setEraser,
    selectedColor,
    selectedBrushWeight,
  } = useAnnotation(canvas);

  const colorList = [
    colors.RED_600,
    colors.BLUE_600,
    colors.GREEN_600,
    colors.YELLOW_600,
  ];

  const brushWeights = [1, 3, 5, 7];

  const canvasColor = computed(() =>
    isDark.value ? colors.GRAY_600 : colors.GRAY_200
  );

  const canvasPatternColor = computed(
    () => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + "15"
  );

  const { width, height } = useWindowSize();
</script>

<template>
  <div class="h-full w-full">
    <ResponsiveCanvas
      @canvas-ref="(el) => (canvas = el)"
      :color="canvasColor"
      :pattern-color="canvasPatternColor"
      :canvas-width="width"
      :canvas-height="height"
    ></ResponsiveCanvas>

    <div class="absolute bottom-12 flex w-full justify-center">
      <AnnotationControls
        :set-brush-weight="setBrushWeight"
        :set-color="setColor"
        :brush-colors="colorList"
        :brush-weights="brushWeights"
        :clear="clear"
        :set-eraser="setEraser"
        :selected-color="selectedColor"
        :selected-brush-weight="selectedBrushWeight"
      />
    </div>
  </div>
</template>
