<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useGraph, useDraggableGraph } from './useGraph';

const canvas = ref<HTMLCanvasElement>();

const { addNode, addEdge } = useDraggableGraph(canvas);

onMounted(() => {
  addNode({ id: 1, x: 100, y: 100 });
  addNode({ id: 2, x: 200, y: 200 });
  addEdge({ from: 1, to: 2 });
});



const padding = 50;
const pageWidth = window.innerWidth - padding * 2;
const pageHeight = window.innerHeight - padding * 2;
</script>

<template>
  <div :style="{ padding: `${padding}px` }">
    <canvas
      :width="pageWidth"
      :height="pageHeight"
      ref="canvas"
      class="bg-white"
    ></canvas>
  </div>
</template>