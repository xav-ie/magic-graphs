<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import type { UnwrapRef } from "vue";
  import GraphCanvas from "@graph/Graph.vue";
  import SimulationPlaybackControls from "@ui/product/sim/SimulationPlaybackControls.vue";
  import AnnotationControls from "@product/graph-sandbox/AnnotationControls.vue";
  import ProductDropdown from "@ui/product/dropdown/ProductDropdown.vue";
  import { useGraphProductBoot } from "@utils/productBoot";
  import type { SimulationRunner } from "./sim/types";
  import type { Graph } from "@graph/types";
  import StartSimButton from "./StartSimButton.vue";
  import StopSimButton from "./StopSimButton.vue";

  const props = defineProps<{
    graph: Graph;
    simulationRunner: { value: UnwrapRef<SimulationRunner> };
  }>();

  const simRunner = computed(() => props.simulationRunner.value);
  const simControls = computed(() => simRunner.value.simControls);
  const running = computed(() => simRunner.value.running);
  const isActive = computed(() => simControls.value.isActive);

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
    <template v-if="running">
      <slot name="top-center-sim"></slot>
    </template>

    <template v-else>
      <slot name="top-center"></slot>
    </template>
  </div>

  <div class="absolute grid place-items-center left-4 top-0 h-full max-w-96">
    <div class="relative max-h-3/4 w-full grid place-items-center overflow-auto">
      <template v-if="running">
        <slot name="center-left-sim"></slot>
      </template>

      <template v-else>
        <slot name="center-left"></slot>
      </template>
    </div>
  </div>

  <div class="absolute grid place-items-center right-4 top-0 h-full max-w-96">
    <div class="relative max-h-3/4 w-full grid place-items-center overflow-auto">
      <template v-if="running">
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
    <template v-if="running">
      <slot name="top-right-sim">
        <StopSimButton @click="simRunner.stop" />
      </slot>
    </template>

    <template v-else>
      <slot name="top-right">
        <StartSimButton @click="simRunner.start" />
      </slot>
    </template>
  </div>

  <div
    class="absolute bottom-8 gap-4 w-full flex flex-col justify-center items-center"
  >
    <div v-if="isActive">
      <SimulationPlaybackControls :controls="{ value: simControls }" />
    </div>

    <div v-show="graph.annotationActive.value">
      <AnnotationControls :graph="graph" />
    </div>
  </div>
</template>
