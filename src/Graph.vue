<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useDarkGraph } from '@/useGraph/useGraph';
import { useWindowSize } from '@vueuse/core';
import { bfsNodeColorizer } from './graphColorizers';
import { nodesEdgesToAdjList, adjListToNodesEdges, type AdjacencyList } from './graphConverters';
import { drawShape } from './shapes/draw';
import { hitboxes } from './shapes/hitboxes';
import type { PersistentGraphSettings } from './useGraph/usePersistentGraph';

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

const graph = useDarkGraph(canvas, {
  theme: {},
  settings: {
    nodeAnchors: true,
    userEditable: {
      addedEdgeType: 'undirected',
    }
  }
});

// watch(graph.settings, () => {
//   console.log(graph.settings.value.nodeAnchors);
// }, { deep: true });

setInterval(() => {
  graph.settings.value.nodeAnchors = !graph.settings.value.nodeAnchors;
}, 2000);

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