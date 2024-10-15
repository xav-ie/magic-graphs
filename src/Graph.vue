<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useDarkPersistentUserEditableGraph } from '@/useGraph/useGraph';
import { useWindowSize } from '@vueuse/core';
import { bfsNodeColorizer } from './graphColorizers';
import { nodesEdgesToAdjList, adjListToNodesEdges, type AdjacencyList } from './graphConverters';
import { drawShape } from './shapes/draw';
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

graph.subscribe('onRepaint', (ctx) => {
  const { drawLine } = drawShape(ctx);
  const start = { x: 100, y: 100 };
  const end = { x: 200, y: 200 };
  drawLine({
    start,
    end,
    color: 'red',
    width: 10,
    text: {
      content: '2',
      fontSize: 16,
      color: 'white',
      bgColor: 'black',
      fontWeight: 'bold',
      offsetFromCenter: -50
    }
  })
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
    <button
      @click.stop="graph.resetGraph"
      class="bg-red-600 text-white px-3 py-1 rounded-lg font-bold m-2 absolute"
    >Reset Graph</button>
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      ref="canvas"
      class="rounded-xl"
    ></canvas>
  </div>
</template>