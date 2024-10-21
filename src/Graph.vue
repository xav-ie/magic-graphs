<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDarkGraph } from '@/useGraph/useGraph';
import { isObject, useWindowSize } from '@vueuse/core';
import { bfsNodeColorizer } from './graphColorizers';
import { nodesEdgesToAdjList, adjListToNodesEdges, type AdjacencyList } from './graphConverters';
import { drawShape } from './shapes/draw';
import { hitboxes } from './shapes/hitboxes';
import type { PersistentGraphSettings } from './useGraph/usePersistentGraph';
import { useGraphBtns } from './useGraphBtns';

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
    userEditable: {},
    displayEdgeLabels: false,
    persistent: {
      storageKey: 'graph',
    }
  }
});

graph.subscribe('onStructureChange', (nodes, edges) => emit(
  'update:modelValue',
  nodesEdgesToAdjList(nodes, edges)
));

const {
  reset,
  changeStorageKey
} = useGraphBtns(graph);

const btns = [
  reset,
  changeStorageKey,
]
</script>

<template>
  <div :style="{ padding: `${padding}px` }">
    <div class="absolute flex gap-2 m-2">
      <div
        v-for="btn in btns"
      >
      <button
          v-if="!btn.cond || btn.cond()"
          @click.stop="btn.action"
          :class="`bg-${btn.color()}-600 text-white px-3 py-1 rounded-lg font-bold`"
        >
          {{ btn.label() }}
        </button>
      </div>
    </div>
    <canvas
      :width="canvasWidth"
      :height="canvasHeight"
      ref="canvas"
      class="rounded-xl"
    ></canvas>
  </div>
</template>