<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { flowNodeLabelGetter, useSourceSinkControls } from "./useSourceSinkControls";
  import { useSourceSinkStyler } from "./useSourceSinkStyler";
  import { useEdgeThickener } from "./useEdgeThickener";
  import { FLOW_GRAPH_SETTINGS } from "./settings";
  import FlowProperties from "./FlowProperties.vue";
  import { useFlowProperties } from "./useFlowProperties";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: FLOW_GRAPH_SETTINGS,
  });

  graph.settings.value.newNodeLabelGetter = flowNodeLabelGetter(graph);

  const sourceSinkControls = useSourceSinkControls(graph);
  const flowProps = useFlowProperties(graph, sourceSinkControls);

  const { activate: activateEdgeThickener } = useEdgeThickener(graph);
  const { stylize: activateFlowColorizer } = useSourceSinkStyler(graph, sourceSinkControls);

  activateEdgeThickener();
  activateFlowColorizer();
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center>
      <FlowProperties :flow-properties="flowProps" />
    </template>

    <template #center-left></template>

    <template #center-right-sim>

    </template>
  </GraphProduct>
</template>
