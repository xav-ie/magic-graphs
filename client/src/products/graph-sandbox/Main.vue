<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { SANDBOX_GRAPH_SETTINGS } from "./settings";
  import IslandToolbar from "./IslandToolbar.vue";
  import IslandMarkup from "./IslandMarkup.vue";
  import { useMarkupColorizer } from "./useMarkupColorizer";
  import { useMarkupSizer } from "./useMarkupSizer";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: SANDBOX_GRAPH_SETTINGS,
  });

  const { colorize, colorMap } = useMarkupColorizer(graph);
  colorize();

  const { size, sizeMap } = useMarkupSizer(graph);
  size();
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center>
      <IslandToolbar />
    </template>

    <template #center-left>
      <IslandMarkup
        v-show="!graph.annotationActive.value"
        :graph="graph"
        :sizeMap="sizeMap"
        :colorMap="colorMap"
      />
    </template>
  </GraphProduct>
</template>
