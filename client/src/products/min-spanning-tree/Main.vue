<script setup lang="ts">
  import { ref } from "vue";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { useGraph } from "@graph/useGraph";
  import { MST_GRAPH_SETTINGS } from "./settings";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: MST_GRAPH_SETTINGS,
  });
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center></template>

    <template #center-left></template>

    <template #top-right></template>
  </GraphProduct>
</template>
