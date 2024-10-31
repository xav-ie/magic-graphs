<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDark } from '@vueuse/core';
import ResponsiveCanvas from '@utils/components/ResponsiveCanvas.vue';
import colors from '@colors';

const canvas = ref<HTMLCanvasElement>();
const isDark = useDark();
const color = computed(() => isDark.value ? colors.GRAY_800 : colors.GRAY_200);
const patternColor = computed(() => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + '15');
</script>

<template>
  <div class="h-full w-full">
    <ResponsiveCanvas
      @canvas-ref="(el) => canvas = el"
      :color="color"
      :pattern-color="patternColor"
    ></ResponsiveCanvas>
  </div>
</template>