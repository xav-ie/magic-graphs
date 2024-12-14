<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { MARKOV_CHAIN_GRAPH_SETTINGS } from "./settings";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, MARKOV_CHAIN_GRAPH_SETTINGS);
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center>

    </template>

    <template #center-left>

    </template>
  </GraphProduct>
</template>
