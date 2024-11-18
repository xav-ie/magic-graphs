<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import { flowNodeLabelGetter, useSourceSinkControls } from "./useFlowControls";
  import SourceSinkControls from "./SourceSinkControls.vue";
  import { useEdgeThickener } from "./useEdgeThickener";
  import { FLOW_GRAPH_SETTINGS } from "./settings";
  import SimulationPlaybackControls from "@ui/sim/SimulationPlaybackControls.vue";
  import { useFlowSimulation } from "./useFlowSimulation";
  import CollabControls from "@playground/graph/CollabControls.vue";
  import FlowProperties from "./FlowProperties.vue";
  import { useFlowProperties } from "./useFlowProperties";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: FLOW_GRAPH_SETTINGS,
  });

  graph.settings.value.newNodeLabelGetter = flowNodeLabelGetter(graph);

  useEdgeThickener(graph);

  const flowControls = useSourceSinkControls(graph);
  const flowProps = useFlowProperties(graph, flowControls);
  const simControls = useFlowSimulation(graph, flowControls);
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
        :controls="flowControls"
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
      <SimulationPlaybackControls :controls="simControls" />
    </div>

    <div
      v-if="!simControls.isActive.value"
      class="absolute right-0 p-3 h-14 flex gap-3 bottom-0"
    >
      <CollabControls :graph="graph" />
    </div>
  </div>
</template>
