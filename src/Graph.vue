<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePersistentDraggableGraph, useDraggableGraph  } from './useGraph';
import { useWindowSize } from '@vueuse/core';

const canvas = ref<HTMLCanvasElement>();

type ConsumableGraph = Record<number, number[]>;

const props = defineProps<{
  modelValue: ConsumableGraph;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ConsumableGraph): void,
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

console.log('defaultNodes', defaultNodes);
console.log('defaultEdges', defaultEdges);

// @ts-expect-error - TS complains about the canvas ref type
usePersistentDraggableGraph(canvas, 'graph', {
  nodes: defaultNodes,
  edges: defaultEdges,
  onStructureChange: (nodes, edges) => {
    // Convert the nodes and edges to a consumable graph
    // must account for nodes that are not connected to any other node
    console.log('structure change', nodes.map(node => node.id));
    const newGraph: ConsumableGraph = {};
    nodes.forEach(node => {
      newGraph[node.id] = edges
      .filter(edge => edge.from === node.id)
      .map(edge => edge.to);
    });
    console.log('newGraph', newGraph);
    emit('update:modelValue', newGraph);
  }
});
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