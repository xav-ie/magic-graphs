<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import { MST_GRAPH_SETTINGS } from "./settings";
  import { usePrimSimulationRunner } from "./useSimulationRunner";
  import { useKruskalSimulationRunner } from "./useSimulationRunner";

  import GraphProduct from "@ui/product/GraphProduct.vue";
  import type { SimulationRunner } from "@ui/product/sim/types";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: MST_GRAPH_SETTINGS,
  });

  const kruskalRunner = useKruskalSimulationRunner(graph);
  const primRunner = usePrimSimulationRunner(graph);

  const runner = ref<SimulationRunner>(kruskalRunner);
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
    :simulation-runner="{ value: runner as SimulationRunner }"
  >
    <template #top-center></template>

    <template #center-left></template>

    <template #top-right></template>
  </GraphProduct>
</template>
