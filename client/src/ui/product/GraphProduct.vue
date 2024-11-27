<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import GraphCanvas from "@graph/Graph.vue";
  import SimulationPlaybackControls from "@ui/product/sim/SimulationPlaybackControls.vue";
  import AnnotationControls from "@product/graph-sandbox/AnnotationControls.vue";
  import ProductDropdown from "@ui/product/dropdown/ProductDropdown.vue";
  import { useGraphProductBoot } from "@utils/productBoot";
  import type { SimulationControls } from "./sim/types";
  import type { Graph } from "@graph/types";

  const props = defineProps<{
    graph: Graph;
    simulation?: SimulationControls | undefined;
  }>();

  const simulationActive = computed(() => props.simulation?.isActive ?? false);

  const emit = defineEmits<{
    (e: "graph-ref", value: HTMLCanvasElement | undefined): void;
  }>();

  const graphEl = ref<HTMLCanvasElement>();

  useGraphProductBoot(props.graph);

  onMounted(() => {
    emit("graph-ref", graphEl.value);
  });
</script>

<template>
  <GraphCanvas
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  />

  <div
    v-show="!simulationActive"
    class="absolute top-6 w-full flex flex-col justify-center items-center gap-2"
  >
    <slot name="top-center"></slot>
  </div>

  <div
    v-show="!simulationActive"
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
    v-if="simulation && simulationActive"
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
