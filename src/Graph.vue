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
import { markovSccColorizer } from './markov-chains/sccColorizer';

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
  settings: {}
});

setTimeout(() => {
  // markovSccColorizer(graph);
}, 0)

graph.subscribe('onStructureChange', (nodes, edges) => emit(
  'update:modelValue',
  nodesEdgesToAdjList(nodes, edges)
));

const {
  reset,
  toggleUserEditable,
  toggleEdgeType,
  changeEdgeWeight,
  clearLocalStorage,
} = useGraphBtns(graph);

const btns = [
  reset,
  clearLocalStorage,
  toggleUserEditable,
  toggleEdgeType,
  changeEdgeWeight,
]

const showBtn = (cond: (() => boolean) | undefined) => cond ? cond() : true
</script>

<template>
  <div :style="{ padding: `${padding}px` }">
    <div class="absolute flex gap-2 m-2">
      <div v-for="btn in btns">
      <button
          v-if="showBtn(btn.cond)"
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