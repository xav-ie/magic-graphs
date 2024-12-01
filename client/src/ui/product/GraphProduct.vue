<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import GraphCanvas from "@graph/Graph.vue";
  import type { Graph } from "@graph/types";
  import SimulationPlaybackControls from "@ui/product/sim/SimulationPlaybackControls.vue";
  import AnnotationControls from "@product/graph-sandbox/AnnotationControls.vue";
  import ProductDropdown from "@ui/product/dropdown/ProductDropdown.vue";
  import SelectSimulation from "@ui/product/sim/SelectSimulation.vue";
  import { useGraphProductBoot } from "@utils/productBoot";
  import StartSimButton from "./StartSimButton.vue";
  import StopSimButton from "./StopSimButton.vue";
  import type { SimulationDeclaration } from "src/types";
  import { getSimulationDeclarationsForProduct } from "@utils/product";

  const props = defineProps<{
    graph: Graph;
  }>();

  const simulations = getSimulationDeclarationsForProduct(props.graph);

  const activeSimulation = ref(simulations[0]);
  const runningSimulation = ref(false);

  const simRunner = computed(() => activeSimulation.value.runner);
  const isActive = computed(() => simRunner.value.simControls.isActive);

  const startSimulation = async () => {
    runningSimulation.value = true;
    await simRunner.value.start();
  };

  const stopSimulation = async () => {
    await simRunner.value.stop();
    runningSimulation.value = false;
  };

  const setActiveSimulation = (simulation: SimulationDeclaration) => {
    activeSimulation.value = simulation;
    startSimulation();
  };

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
    class="absolute top-6 w-full flex flex-col justify-center items-center gap-2"
  >
    <template v-if="runningSimulation">
      <slot name="top-center-sim"></slot>
    </template>

    <template v-else>
      <slot name="top-center"></slot>
    </template>
  </div>

  <div class="absolute grid place-items-center left-4 top-0 h-full max-w-96">
    <div
      class="relative max-h-3/4 w-full grid place-items-center overflow-auto"
    >
      <template v-if="runningSimulation">
        <slot name="center-left-sim"></slot>
      </template>

      <template v-else>
        <slot name="center-left"></slot>
      </template>
    </div>
  </div>

  <div class="absolute grid place-items-center right-4 top-0 h-full max-w-96">
    <div
      class="relative max-h-3/4 w-full grid place-items-center overflow-auto"
    >
      <template v-if="runningSimulation">
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
    <template v-if="runningSimulation">
      <slot name="top-right-sim">
        <StopSimButton @click="stopSimulation" />
      </slot>
    </template>

    <template v-else>
      <slot name="top-right">
        <template v-if="simulations.length > 1">
          <SelectSimulation
            @simulation-selected="setActiveSimulation"
            :simulations="simulations"
          />
        </template>
        <template v-else>
          <StartSimButton @click="startSimulation" />
        </template>
      </slot>
    </template>
  </div>

  <div
    class="absolute bottom-8 gap-4 w-full flex flex-col justify-center items-center"
  >
    <div v-if="isActive">
      <SimulationPlaybackControls :controls="simRunner.simControls" />
    </div>

    <div v-show="graph.annotationActive.value">
      <AnnotationControls :graph="graph" />
    </div>
  </div>
</template>
