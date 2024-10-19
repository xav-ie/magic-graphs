<script setup lang="ts">
import { computed, ref } from 'vue';
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
  settings: {
    userEditable: {
      addedEdgeType: 'undirected',
    }
  }
});

graph.subscribe('onStructureChange', (nodes, edges) => emit(
  'update:modelValue',
  nodesEdgesToAdjList(nodes, edges)
))

const toggleEdgeType = () => {
  const edgeType = graph.settings.value.userEditable.addedEdgeType;
  if (edgeType === 'directed') {
    graph.settings.value.userEditable.addedEdgeType = 'undirected';
  } else {
    graph.settings.value.userEditable.addedEdgeType = 'directed';
  }
}

const settings = computed(() => graph.settings.value);
const userEditSettings = computed(() => settings.value.userEditable);

const btns = [
  {
    label: () => 'Reset Graph',
    action: () => graph.resetGraph(),
    color: () => 'red-600'
  },
  {
    label: () => userEditSettings.value.addedEdgeType === 'directed' ? 'Directed' : 'Undirected',
    action: () => toggleEdgeType(),
    color: () => userEditSettings.value.addedEdgeType === 'directed' ? 'blue-600' : 'purple-600'
  },
  {
    label: () => settings.value.draggable ? 'Draggable' : 'Not Draggable',
    action: () => graph.settings.value.draggable = !settings.value.draggable,
    color: () => settings.value.draggable ? 'green-600' : 'orange-600'
  },
  {
    label: () => settings.value.nodeAnchors ? 'Anchors' : 'No Anchors',
    action: () => graph.settings.value.nodeAnchors = !settings.value.nodeAnchors,
    color: () => settings.value.nodeAnchors ? 'green-600' : 'orange-600'
  },
  {
    label: () => 'Change Node Size' + ` (${graph.theme.value.nodeSize})`,
    action: () => graph.theme.value.nodeSize = Math.floor(Math.random() * (50 - 10 + 1)) + 10,
    color: () => 'blue-900'
  }
]

</script>

<template>
  <div :style="{ padding: `${padding}px` }">
    <div class="absolute flex gap-2 m-2">
      <button
        v-for="btn in btns"
        @click.stop="btn.action"
        :class="`bg-${btn.color()} text-white px-3 py-1 rounded-lg font-bold`"
      >{{ btn.label() }}</button>
    </div>
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      ref="canvas"
      class="rounded-xl"
    ></canvas>
  </div>
</template>