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
import { useGraphTutorial } from './useGraph/tutorial';

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
const canvasHeight = computed(() => (height.value) - padding * 2);

const graph = useDarkGraph(canvas, {
  theme: {},
  settings: {}
});

// setTimeout(() => {
//   markovSccColorizer(graph);
// }, 0)

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

useGraphTutorial(graph, [
  // {
  //   hint: 'Double click anywhere to add a node',
  //   dismiss: 'onNodeAdded'
  // },
  // {
  //   hint: 'Drag a node to move it',
  //   dismiss: 'onNodeDrop'
  // },
  {
    hint: 'Create an edge by dragging an anchor onto another node',
    dismiss: 'onEdgeAdded'
  },
  {
    hint: 'Now create an undirected edge by flipping the edge type',
    dismiss:
    {
      event: 'onEdgeAdded',
      predicate: (edge) => edge.type === 'undirected'
    }
  },
  {
    hint: 'Edit the edge weight by clicking on it and typing a number',
    dismiss: 'onEdgeWeightChange'
  },
  {
    hint: 'Remove an edge or node by clicking on it and hitting backspace/delete',
    dismiss: 'onNodeRemoved'
  },
  {
    hint: 'Now have fun!',
    dismiss: 'onCron',
    after: 3000
  }
]);

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
          <span class="select-none">
            {{ btn.label() }}
          </span>
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