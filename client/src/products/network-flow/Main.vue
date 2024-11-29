<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import SimulationPlaybackControls from "@ui/product/sim/SimulationPlaybackControls.vue";
  import { flowNodeLabelGetter, useSourceSinkControls } from "./useSourceSinkControls";
  import { useSourceSinkStyler } from "./useSourceSinkStyler";
  import SourceSinkControls from "./SourceSinkControls.vue";
  import { useEdgeThickener } from "./useEdgeThickener";
  import { FLOW_GRAPH_SETTINGS } from "./settings";
  import { useFlowSimulation } from "./useFlowSimulation";
  import FlowProperties from "./FlowProperties.vue";
  import { useFlowProperties } from "./useFlowProperties";
import { useGraphProductBoot } from "@utils/productBoot";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: FLOW_GRAPH_SETTINGS,
  });

  graph.settings.value.newNodeLabelGetter = flowNodeLabelGetter(graph);

  const sourceSinkControls = useSourceSinkControls(graph);
  const flowProps = useFlowProperties(graph, sourceSinkControls);
  const simControls = useFlowSimulation(graph, sourceSinkControls);

  const { activate: activateEdgeThickener } = useEdgeThickener(graph);
  const { stylize: activateFlowColorizer } = useSourceSinkStyler(graph, sourceSinkControls);

  activateEdgeThickener();
  activateFlowColorizer();

  useGraphProductBoot(graph)
</script>

<template>
  <div class="w-full h-full relative">
    <div class="absolute w-full h-full">
      <Graph
        @graph-ref="(el) => (graphEl = el)"
        :graph="graph"
      />
    </div>

    <div class="absolute top-0 p-3">
      <SourceSinkControls
        :sourceSink="sourceSinkControls"
        :sim-controls="simControls"
      />
    </div>

    <div class="absolute top-0 right-0 p-3 text-white flex gap-3">
      <FlowProperties :flow-properties="flowProps" />
    </div>

    <div
      v-if="simControls.isActive.value"
      class="absolute bottom-8 w-full flex justify-center items-center p-3"
    >
      <SimulationPlaybackControls :controls="{ value: simControls }" />
    </div>
  </div>
</template>
