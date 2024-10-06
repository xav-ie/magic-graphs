<script setup lang="ts">
import { computed, ref, } from 'vue';
import { useDarkUserEditableGraph, useGraph, useDraggableGraph, useUserEditableGraph, type Node } from './useGraph';
import { useWindowSize } from '@vueuse/core';
// import { bfsNodeColorizer } from './graphColorizer';

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
// 50 for temp input
const canvasHeight = computed(() => ((height.value / 2) - 50) - padding * 2);

const getRandomBetweenRange = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

const getRandomPointOnCanvas = () => ({
  x: getRandomBetweenRange(50, canvasWidth.value - 50),
  y: getRandomBetweenRange(50, canvasHeight.value - 50),
});

const defaultNodes = Object.keys(props.modelValue).map(() => getRandomPointOnCanvas());

const defaultEdges = Object.entries(props.modelValue).flatMap(([from, tos]) =>
  tos.map(to => ({ from: Number(from), to: Number(to) }))
);

const { addEdge, subscribe } = useDarkUserEditableGraph(canvas, {
  nodes: defaultNodes,
  edges: defaultEdges,
});

subscribe('onStructureChange', (nodes, edges) => emit(
  'update:modelValue',
  nodes.reduce<ConsumableGraph>((acc, node) => {
    acc[node.id] = edges
      .filter(edge => edge.from === node.id)
      .map(edge => edge.to);
    return acc;
  }, {})
))

const tempEdgeInput = ref('');

const createEdge = () => {
  const [from, to] = tempEdgeInput.value.split(' ').map(Number);
  if (from && to) {
    // while we only support undirected graphs, we add both edges
    addEdge({ from, to });
    addEdge({ from: to, to: from });
    tempEdgeInput.value = '';
  }
};
</script>

<template>
  <div :style="{ padding: `${padding}px` }">
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      ref="canvas"
      class="bg-gray-600 rounded-xl"
    ></canvas>
    <input
      v-model="tempEdgeInput"
      @keydown.enter="createEdge"
      class="w-full px-3 py-2 mt-3 bg-gray-800 text-white rounded-full"
    />
  </div>
</template>