<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useDarkPersistentUserEditableGraph } from '@/useGraph/useGraph';
import { useWindowSize } from '@vueuse/core';
import { bfsNodeColorizer } from './graphColorizers';
import { nodesEdgesToAdjList, adjListToNodesEdges, type AdjacencyList } from './graphConverters';
import { drawShape, fn } from './shapes/draw';
import { hitboxes } from './shapes/hitboxes';

const canvas = ref<HTMLCanvasElement>();

const props = defineProps<{
  modelValue: AdjacencyList;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: AdjacencyList): void,
}>();

const padding = 20;
const { width, height } = useWindowSize();
const canvasWidth = computed(() => width.value - padding * 2);
const canvasHeight = computed(() => (height.value / 2) - padding * 2);

const graph = useDarkPersistentUserEditableGraph(canvas, 'graph');

const a = { x: 100, y: 100 };
const b = { x: 200, y: 100 };
const c = { x: 150, y: 200 };

graph.subscribe('onRepaint', (ctx) => {
  // const { drawTriangle, drawLine, drawCircle } = drawShape(ctx);
  // const line = { start: { x: 100, y: 200 }, end: { x: 800, y: 300 } };
  // drawLine({ ...line, color: 'red', width: 12 });
  // const dx = line.end.x - line.start.x;
  // const dy = line.end.y - line.start.y;
  // const lineLength = Math.sqrt(dx * dx + dy * dy);
  // const offset = 100;
  // const scaleFactor = lineLength / offset;
  // const scaledDx = dx / scaleFactor;
  // const scaledDy = dy / scaleFactor;
  // const scaledEnd = { x: line.end.x - scaledDx, y: line.end.y - scaledDy };
  // drawCircle({
  //   at: scaledEnd,
  //   radius: 6,
  //   color: 'blue',
  // })
})

const { nodes: defaultNodes, edges: defaultEdges } = adjListToNodesEdges(props.modelValue);
onMounted(() => {
  // defaultNodes.forEach(node => graph.addNode(node, false));
  // defaultEdges.forEach(edge => graph.addEdge(edge));
});

graph.subscribe('onStructureChange', (nodes, edges) => emit(
  'update:modelValue',
  nodesEdgesToAdjList(nodes, edges)
))
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