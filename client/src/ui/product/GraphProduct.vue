<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import SimulationPlaybackControls from "@ui/product/sim/SimulationPlaybackControls.vue";
  import AnnotationControls from "@product/graph-sandbox/AnnotationControls.vue";
  import ProductDropdown from "@ui/product/dropdown/ProductDropdown.vue";
  import { useGraphProductBoot } from "@utils/productBoot";
  import type { GraphSettings } from "@graph/settings";
  import type { SimulationControls } from "./sim/types";

  const props = defineProps<{
    settings: Partial<GraphSettings>;
    simulation: SimulationControls;
  }>();

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: props.settings,
  });

  useGraphProductBoot(graph);
</script>

<template>
  <Graph
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  />

  <div
    v-show="!props.simulation.isActive"
    class="absolute top-6 w-full flex flex-col justify-center items-center gap-2"
  >
    <slot name="top-center"></slot>
  </div>

  <div
    v-show="!props.simulation.isActive"
    class="absolute top-0 w-0 h-full flex items-center"
  >
    <div class="ml-4">
      <slot name="center-left"></slot>
    </div>
  </div>

  <div class="absolute top-6 left-6">
    <ProductDropdown />
  </div>

  <div class="absolute top-6 right-6">
    <slot name="top-right"></slot>
  </div>

  <div
    v-show="props.simulation.isActive"
    class="absolute bottom-8 w-full flex justify-center items-center p-3"
  >
    <SimulationPlaybackControls :controls="simulation" />
  </div>

  <div
    v-show="graph.annotationActive.value"
    class="absolute bottom-8 w-full flex justify-center items-center p-3"
  >
    <AnnotationControls :graph="graph" />
  </div>
</template>
