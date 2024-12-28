<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { BINARY_TREE_GRAPH_SETTINGS } from "./settings";
  import CRUDControls from "./ui/CRUDControls.vue";
  import TreeInfoLabels from "./ui/TreeInfoLabels.vue";
  import { useTree } from "./useTree";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, BINARY_TREE_GRAPH_SETTINGS);

  const tree = useTree(graph);
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center>
      <CRUDControls :tree="tree" />
    </template>

    <template #bottom-center>
      <TreeInfoLabels :tree="tree" />
    </template>
  </GraphProduct>
</template>
