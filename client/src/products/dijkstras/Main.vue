<script setup lang="ts">
  import { ref } from 'vue';
  import { useGraph } from '@graph/useGraph';
  import GraphProduct from '@ui/product/GraphProduct.vue';
  import CostDisplay from './ui/CostDisplay.vue';
  import { DIJKSTRAS_GRAPH_SETTINGS } from './settings';
  import { isRunning } from './sim/runner';

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, DIJKSTRAS_GRAPH_SETTINGS);
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center></template>

    <template #center-left></template>

    <template #center-right-sim>
      <div class="bg-gray-800 bg-opacity-80 p-2 rounded-xl overflow-auto">
        <CostDisplay :is-running="isRunning" />
      </div>
    </template>
  </GraphProduct>
</template>
