<script setup lang="ts">
import { ref, computed } from "vue";
import { useDark, useWindowSize } from "@vueuse/core";
import ResponsiveCanvas from "@utils/components/ResponsiveCanvas.vue";
import colors from "@colors";
import { useAnnotation } from "./useAnnotation";

const canvas = ref<HTMLCanvasElement>();
const isDark = useDark();

useAnnotation(canvas)

const color = computed(() =>
  isDark.value ? colors.GRAY_800 : colors.GRAY_200
);

const patternColor = computed(
  () => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + "15"
);

const { width, height } = useWindowSize();


// THIS ALL NEEDS TO GET MOVED TO ITS OWN FILE WITH NICE EXPORTS

</script>

<template>
  <div class="h-full w-full">
    <!-- <div class="absolute m-3 flex gap-3 z-50">
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
      ></button> -->
    <!-- </div> -->

    <ResponsiveCanvas
      @canvas-ref="(el) => (canvas = el)"
      :color="color"
      :pattern-color="patternColor"
      :canvas-width="width"
      :canvas-height="height"
    ></ResponsiveCanvas>
  </div>
</template>
