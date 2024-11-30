<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { useSourceSinkStyler } from "./useSourceSinkStyler";
  import { useEdgeThickener } from "./useEdgeThickener";
  import { FLOW_GRAPH_SETTINGS, flowNodeLabelGetter } from "./settings";
  import FlowProperties from "./FlowProperties.vue";
  import { useFlowProperties } from "./useFlowProperties";
  import SourceSinkControls from "./SourceSinkControls.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: FLOW_GRAPH_SETTINGS,
  });

  graph.settings.value.newNodeLabelGetter = flowNodeLabelGetter(graph);

  const flowProps = useFlowProperties(graph);

  const { activate: activateEdgeThickener } = useEdgeThickener(graph);
  const { stylize: activateFlowColorizer } = useSourceSinkStyler(graph);

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
      <SourceSinkControls />
    </template>

    <template #center-left></template>

    <template #center-right-sim>

    </template>
  </GraphProduct>
</template>
