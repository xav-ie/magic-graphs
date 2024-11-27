<script setup lang="ts">
  import { computed, ref } from "vue";
  import type {
    SimulationDeclaration,
    SimulationDeclarationGetter,
  } from "src/types";
  import { useGraph } from "@graph/useGraph";
  import { SANDBOX_GRAPH_SETTINGS } from "./settings";
  import IslandToolbar from "./IslandToolbar.vue";
  import IslandMarkup from "./IslandMarkup.vue";
  import { useMarkupColorizer } from "./useMarkupColorizer";
  import { useMarkupSizer } from "./useMarkupSizer";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import SimulationStarter from "./SimulationStarter.vue";
  import SimulationStopper from "./SimulationStopper.vue";
  import { getSimulationDeclarations } from "@utils/product";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: SANDBOX_GRAPH_SETTINGS,
  });

  const activeSimulation = ref<SimulationDeclaration>();

  const { colorize, colorMap } = useMarkupColorizer(graph);
  colorize();

  const { size, sizeMap } = useMarkupSizer(graph);
  size();

  const runner = computed(() => activeSimulation.value?.runner);

  const simulations = getSimulationDeclarations(graph)
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
    :simulation-runner="runner"
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
      <SimulationStarter
        v-model="activeSimulation"
        :simulations="simulations"
      />
    </template>

    <template #top-right-sim>
      <SimulationStopper v-model="activeSimulation" />
    </template>
  </GraphProduct>
</template>
