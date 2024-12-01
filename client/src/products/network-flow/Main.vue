<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { useSourceSinkTheme } from "./theme/useSourceSinkTheme";
  import { useEdgeThickener } from "./theme/useEdgeThickener";
  import { FLOW_GRAPH_SETTINGS, flowNodeLabelGetter } from "./settings";
  import FordFulkersonOutput from "./ui/FordFulkersonOutput.vue";
  import SourceSinkControls from "./ui/SourceSinkControls.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: FLOW_GRAPH_SETTINGS,
  });

  graph.settings.value.newNodeLabelGetter = flowNodeLabelGetter(graph);

  const { activate: activateEdgeThickener } = useEdgeThickener(graph);
  const { stylize: activateFlowColorizer } = useSourceSinkTheme(graph);

  activateEdgeThickener();
  activateFlowColorizer();
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center>
      <FordFulkersonOutput />
      <SourceSinkControls />
    </template>

    <template #center-left></template>

    <template #center-right-sim></template>
  </GraphProduct>
</template>
