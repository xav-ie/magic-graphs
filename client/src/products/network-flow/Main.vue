<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import { useFlowControls } from "./useFlowControls";
  import SourceSinkControls from "./SourceSinkControls.vue";
  import { useEdgeThickener } from "./useEdgeThickener";
  import { FLOW_GRAPH_SETTINGS } from "./settings";
  import NetworkFlowStats from "./NetworkFlowStats.vue";
  import NetworkFlowSim from "./NetworkFlowSim.vue";
  import { useFlowSimulation } from "./useFlowSimulation";
  import CollabControls from "@playground/graph/CollabControls.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: FLOW_GRAPH_SETTINGS,
  });

  useEdgeThickener(graph);
  const controls = useFlowControls(graph);
  const simulationControls = useFlowSimulation(graph);
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
        :controls="controls"
        :sim-controls="simulationControls"
      />
    </div>

    <div class="absolute top-0 right-0 p-3 text-white flex gap-3">
      <NetworkFlowStats :graph="graph" />
    </div>

    <div class="absolute bottom-8 w-full flex justify-center items-center p-3">
      <NetworkFlowSim :sim-controls="simulationControls" />
    </div>

    <div
      v-if="!simulationControls.simulationActive.value"
      class="absolute right-0 p-3 h-14 flex gap-3 bottom-0"
    >
      <CollabControls :graph="graph" />
    </div>
  </div>
</template>
