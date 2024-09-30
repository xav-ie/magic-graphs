<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePersistentDraggableGraph } from './useGraph';
import { useWindowSize } from '@vueuse/core';

const canvas = ref<HTMLCanvasElement>();

const props = defineProps<{
  modelValue: Record<number, number[]>;
}>();

const padding = 20;
const { width, height } = useWindowSize();
const canvasWidth = computed(() => width.value - padding * 2);
const canvasHeight = computed(() => (height.value / 2) - padding * 2);

const getRandomBetweenRange = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

const getRandomPointOnCanvas = () => ({
  x: getRandomBetweenRange(50, canvasWidth.value - 50),
  y: getRandomBetweenRange(50, canvasHeight.value - 50),
});

const defaultNodes = Object.keys(props.modelValue).map(() => getRandomPointOnCanvas());

const defaultEdges = Object.entries(props.modelValue).flatMap(([from, tos]) =>
  tos.map(to => ({ from: Number(from), to: Number(to) }))
);

// @ts-expect-error - TS complains about the canvas ref type
usePersistentDraggableGraph(canvas, 'graph', {
  nodes: defaultNodes,
  edges: defaultEdges,
})
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