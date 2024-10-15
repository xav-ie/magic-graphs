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
  // const { drawSquare } = drawShape(ctx);
  // const sq = {"at":{"x":495.9698429203579,"y":173.08167306752438},"width":40,"height":40}
  // drawSquare(sq);
})

graph.subscribe('onClick', (ev) => {
  const { offsetX: x, offsetY: y } = ev;
  const topItem = graph.getDrawItemsByCoordinates(x, y).pop();
  if (!topItem) return;
  const { isInLineText } = hitboxes({ x, y });
  if (topItem.schemaType === 'arrow' && isInLineText(topItem.schema)) {
    // create a text input
    const input = document.createElement('textarea');
    input.style.position = 'absolute';
    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.style.width = '40px';
    input.style.height = '40px';
    input.style.zIndex = '1000';
    // disable resizing
    input.style.resize = 'none';
    input.style.overflow = 'hidden';
    input.style.border = 'none';
    input.style.padding = '0';
    input.style.margin = '0';
    input.style.fontSize = '20px';
    input.style.color = 'white';
    input.style.backgroundColor = graph.options.value.graphBgColor;
    input.style.fontFamily = 'Arial';
    input.style.textAlign = 'center';
    input.style.fontWeight = 'bold';
    input.style.outline = 'none';
    input.value = topItem.schema.text?.content || '';
    input.onblur = () => {
      input.remove();
    }
    document.body.appendChild(input);
    input.focus();
  }
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