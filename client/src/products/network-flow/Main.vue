<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import { flowNodeLabelGetter, useSourceSinkControls } from "./useSourceSinkControls";
  import { useSourceSinkStyler } from "./useSourceSinkStyler";
  import SourceSinkControls from "./SourceSinkControls.vue";
  import { useEdgeThickener } from "./useEdgeThickener";
  import { FLOW_GRAPH_SETTINGS } from "./settings";
  import FlowProperties from "./FlowProperties.vue";
  import { useFlowProperties } from "./useFlowProperties";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import type { SimulationRunner } from "@ui/product/sim/types";
  import { useSimulationRunner } from "./useSimulationRunner";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: FLOW_GRAPH_SETTINGS,
  });

  graph.settings.value.newNodeLabelGetter = flowNodeLabelGetter(graph);

  const sourceSinkControls = useSourceSinkControls(graph);
  const flowProps = useFlowProperties(graph, sourceSinkControls);

  const simRunnerRaw = useSimulationRunner(graph);
  const simRunner = ref<SimulationRunner>(simRunnerRaw);

  const { activate: activateEdgeThickener } = useEdgeThickener(graph);
  const { stylize: activateFlowColorizer } = useSourceSinkStyler(graph, sourceSinkControls);

  activateEdgeThickener();
  activateFlowColorizer();
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
    :simulation-runner="{ value: simRunner as SimulationRunner }"
  >
    <template #top-center>
      <FlowProperties :flow-properties="flowProps" />
      <SourceSinkControls
        :source-sink="sourceSinkControls"
        :sim-controls="simRunner.simControls"
      />
    </template>

    <template #center-left></template>

    <template #center-right-sim>

    </template>
  </GraphProduct>
</template>
