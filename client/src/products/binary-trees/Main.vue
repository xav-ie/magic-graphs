<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { BINARY_TREE_GRAPH_SETTINGS } from "./settings";
  import CRUDControls from "./components/CRUDControls.vue";
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
    <template #bottom-center>
      <CRUDControls :tree="tree" />
    </template>
  </GraphProduct>
</template>
