<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { MARKOV_CHAIN_GRAPH_SETTINGS } from "./settings";
  import { useMarkovColorizer } from "./ui/useMarkovColorizer";
  import MarkovChainInfo from "./ui/MarkovChainInfo.vue";
  import { useMarkovChain } from "./misc/useMarkovChain";

  const graphEl = ref<HTMLCanvasElement>();

  const graph = useGraph(graphEl, MARKOV_CHAIN_GRAPH_SETTINGS);
  const markov = useMarkovChain(graph);

  useMarkovColorizer(graph, markov).colorize();
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center>
      <MarkovChainInfo :markov="markov" />
    </template>

    <template #center-left>

    </template>
  </GraphProduct>
</template>
