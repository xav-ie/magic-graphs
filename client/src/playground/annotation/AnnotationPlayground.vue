<script setup lang="ts">
import { ref, computed } from "vue";
import { useDark, useWindowSize } from "@vueuse/core";
import ResponsiveCanvas from "@utils/components/ResponsiveCanvas.vue";
import colors from "@colors";
import { useAnnotation } from "./useAnnotation";
import AnnotationControls from './AnnotationControls.vue'

const canvas = ref<HTMLCanvasElement>();
const isDark = useDark();

const {
  setBrushWeight,
  setColor,
  clear,
  setEraser,
} = useAnnotation(canvas)

const colorList = ["red", "blue", "green", "yellow"];
const brushWeights = [1, 3, 5, 7]

const color = computed(() =>
  isDark.value ? colors.GRAY_800 : colors.GRAY_200
);

const patternColor = computed(
  () => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + "15"
);

const { width, height } = useWindowSize();

</script>

<template>
  <div class="h-full w-full">

    <AnnotationControls :set-brush-weight="setBrushWeight" :set-color="setColor" :brush-colors="colorList" :brush-weights="brushWeights" :clear="clear" :set-eraser="setEraser" />

    <ResponsiveCanvas
      @canvas-ref="(el) => (canvas = el)"
      :color="color"
      :pattern-color="patternColor"
      :canvas-width="width"
      :canvas-height="height"
    ></ResponsiveCanvas>
  </div>
</template>
