<script setup lang="ts">
  import { ref } from "vue";
  import type { SimulationDeclaration } from "src/types";
  import { useGraph } from "@graph/useGraph";
  import { SANDBOX_GRAPH_SETTINGS } from "./settings";
  import IslandToolbar from "./IslandToolbar.vue";
  import IslandMarkup from "./IslandMarkup.vue";
  import { useMarkupColorizer } from "./useMarkupColorizer";
  import { useMarkupSizer } from "./useMarkupSizer";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import SelectSimulation from "./SelectSimulation.vue";
  import { getSimulationDeclarations } from "@utils/product";
  import type { SimulationRunner } from "@ui/product/sim/types";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: SANDBOX_GRAPH_SETTINGS,
  });

  const simulations = getSimulationDeclarations(graph);
  const activeSimulation = ref<SimulationDeclaration>(simulations[1]);

  const { colorize, colorMap } = useMarkupColorizer(graph);
  colorize();

  const { size, sizeMap } = useMarkupSizer(graph);
  size();

  const setActiveSimulation = (simulation: SimulationDeclaration) => {
    const { runner } = simulation;
    activeSimulation.value = simulation;
    runner.start();
  };
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
    :simulation-runner="{ value: activeSimulation.runner as SimulationRunner }"
  >
    <template #top-center>
      <IslandToolbar :graph="graph" />
    </template>

    <template #center-left>
      <IslandMarkup
        v-show="!graph.annotationActive.value"
        :graph="graph"
        :sizeMap="sizeMap"
        :colorMap="colorMap"
      />
    </template>

    <template #top-right>
      <SelectSimulation
        @simulation-selected="setActiveSimulation"
        :simulations="simulations"
      />
    </template>
  </GraphProduct>
</template>
