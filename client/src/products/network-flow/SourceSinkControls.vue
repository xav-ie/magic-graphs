<script setup lang="ts">
  import type { NetworkFlowControls } from "./useFlowControls";
  import colors from "@utils/colors";
  import Button from "@ui/Button.vue";
  import type { FlowSimulationControls } from "./useFlowSimulation";

  const props = defineProps<{
    simControls: FlowSimulationControls;
    controls: NetworkFlowControls;
  }>();
</script>

<template>
  <div class="flex gap-3">
    <Button
      v-if="!simControls.simulationActive.value"
      :style="{
        backgroundColor: colors.BLUE_500,
        color: colors.WHITE,
      }"
      @click="simControls.startSimulation"
    >
      Run Flow Simulation
    </Button>

    <Button
      v-else="!simControls.simulationActive.value"
      :style="{
        backgroundColor: colors.RED_600,
        color: colors.WHITE,
      }"
      @click="simControls.stopSimulation"
    >
      Stop Simulation
    </Button>

    <div
      v-if="!props.simControls.simulationActive.value"
      class="flex gap-3"
    >
      <Button
        v-if="!controls.makingSource.value"
        @click="controls.makeSource"
      >
        Switch Source
      </Button>

      <Button
        v-else
        :style="{
          backgroundColor: colors.RED_500,
          color: colors.WHITE,
        }"
      >
        Cancel
      </Button>

      <Button
        v-if="!controls.makingSink.value"
        @click="controls.makeSink"
      >
        Switch Sink
      </Button>

      <Button
        v-else
        :style="{
          backgroundColor: colors.RED_500,
          color: colors.WHITE,
        }"
      >
        Cancel
      </Button>
    </div>
  </div>
</template>
