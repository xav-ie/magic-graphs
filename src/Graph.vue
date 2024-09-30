<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePersistentDraggableGraph } from './useGraph';
import { useWindowSize } from '@vueuse/core';

const canvas = ref<HTMLCanvasElement>();

usePersistentDraggableGraph(canvas, 'graph', {
  nodes: [{ x: 100, y: 100 }, { x: 200, y: 200 }],
  edges: [{ from: 1, to: 2 }],
})

const padding = 20;
const { width, height } = useWindowSize();
const canvasWidth = computed(() => width.value - padding * 2);
const canvasHeight = computed(() => (height.value / 2) - padding * 2);
</script>

<template>
  <div :style="{ padding: `${padding}px` }">
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      ref="canvas"
      class="bg-gray-600 rounded-xl"
    ></canvas>
  </div>
</template>