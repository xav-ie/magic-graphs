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
    /**
     * simulation controls for the graph
     */
    simulation?: SimulationControls | undefined;
    /**
     * simulation mode hides ui elements that are not needed during simulation.
     * if not provided, defaults to {@link SimulationControls.isActive | simulation.isActive}
     */
    inSimulationMode?: boolean;
  }>();

  const inSimulationMode = computed(
    () => props.inSimulationMode ?? props.simulation?.isActive ?? false
  );

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

  <div class="absolute top-6 w-full flex flex-col justify-center items-center gap-2">
    <template v-if="inSimulationMode">
      <slot name="top-center-sim"></slot>
    </template>

    <template v-else>
      <slot name="top-center"></slot>
    </template>
  </div>

  <div class="absolute left-4 top-0 h-full flex items-center">
    <template v-if="inSimulationMode">
      <slot name="center-left-sim"></slot>
    </template>

    <template v-else>
      <slot name="center-left"></slot>
    </template>
  </div>

  <div class="absolute grid place-items-center right-4 top-0 h-full max-w-96 overflow-auto">
    <div class="relative h-[90%] w-full grid place-items-center overflow-auto">
      <!-- <div class="bg-green-400 bg-opacity-50 h-[900px] w-[50px]"></div> -->
      <template v-if="inSimulationMode">
        <slot name="center-right-sim"></slot>
      </template>

      <template v-else>
        <slot name="center-right"></slot>
      </template>
    </div>
  </div>

  <div class="absolute top-6 left-6">
    <ProductDropdown />
  </div>

  <div class="absolute top-6 right-6">
    <template v-if="inSimulationMode">
      <slot name="top-right-sim"></slot>
    </template>

    <template v-else>
      <slot name="top-right"></slot>
    </template>
  </div>

  <div class="absolute bottom-8 gap-4 w-full flex flex-col justify-center items-center">
    <div v-if="simulation && simulation.isActive">
      <SimulationPlaybackControls :controls="simulation" />
    </div>

    <div v-show="graph.annotationActive.value" >
      <AnnotationControls :graph="graph" />
    </div>
  </div>
</template>
