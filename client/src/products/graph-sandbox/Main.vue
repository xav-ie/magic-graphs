<script setup lang="ts">
  import { ref } from "vue";
  import type { SimulationDeclaration } from "src/types";
  import { useGraph } from "@graph/useGraph";
  import { SANDBOX_GRAPH_SETTINGS } from "./settings";
  import IslandToolbar from "./IslandToolbar.vue";
  import IslandMarkup from "./IslandMarkup.vue";
  import SimulationDropdown from "./SimulationDropdown.vue";
  import { useMarkupColorizer } from "./useMarkupColorizer";
  import { useMarkupSizer } from "./useMarkupSizer";
  import GraphProduct from "@ui/product/GraphProduct.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: SANDBOX_GRAPH_SETTINGS,
  });

  const activeSimulation = ref<SimulationDeclaration>();

  const { colorize, colorMap } = useMarkupColorizer(graph);
  colorize();

  const { size, sizeMap } = useMarkupSizer(graph);
  size();
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
    :simulation="activeSimulation?.controls"
  >
    <template #top-center>
      <IslandToolbar
        v-show="!activeSimulation"
        :graph="graph"
      />
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
      <SimulationDropdown
        v-model="activeSimulation"
        :graph="graph"
      />
    </template>
  </GraphProduct>
</template>
