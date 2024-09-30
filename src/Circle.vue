<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDraggableGraph } from './useGraph';
import { themes } from './themes';
import { useWindowSize } from '@vueuse/core';

const canvas = ref<HTMLCanvasElement>();

const { addNode, addEdge } = useDraggableGraph(canvas)

addNode({ x: 100, y: 100 });
addNode({ x: 200, y: 200 });
addEdge({ from: 1, to: 2 });

const padding = 50;
const { width, height } = useWindowSize();
const canvasWidth = computed(() => width.value - padding * 2);
const canvasHeight = computed(() => height.value - padding * 2);
</script>

<template>
  <div :style="{ padding: `${padding}px` }">
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      ref="canvas"
      class="bg-white"
    ></canvas>
  </div>
</template>