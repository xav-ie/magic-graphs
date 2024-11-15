<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import Button from "@ui/Button.vue";
  import type { MSTAlgorithm, MSTSimulationControls } from "./useSimulation";
  import { MST_ALGORITHMS } from "./useSimulation";
  import colors from "@utils/colors";

  const props = defineProps<{
    graph: Graph;
    simControls: MSTSimulationControls;
    startSimulation: (algorithm: MSTAlgorithm) => void;
  }>();
</script>

<template>
  <div
    v-if="!simControls.isActive.value"
    class="gap-3 flex"
  >
    <Button
      v-for="algorithm in MST_ALGORITHMS"
      @click="() => startSimulation(algorithm)"
      class="capitalize"
    >
      Run {{ algorithm }}s
    </Button>
  </div>

  <Button
    v-else
    @click="simControls.stop"
    :color="colors.RED_600"
    :text-color="colors.WHITE"
    class="capitalize"
  >
    Stop Simulation
  </Button>
</template>
