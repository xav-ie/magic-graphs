<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { MARKOV_CHAIN_GRAPH_SETTINGS } from "./settings";
  import { useMarkovColorizer } from "./ui/useMarkovColorizer";
  import MarkovChainInfo from "./ui/MarkovChainInfo.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, MARKOV_CHAIN_GRAPH_SETTINGS);
  const colorChain = useMarkovColorizer(graph);
  colorChain.colorize();
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center>
      <MarkovChainInfo />
    </template>

    <template #center-left>

    </template>
  </GraphProduct>
</template>
