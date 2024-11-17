<script setup lang="ts">
  import type { NetworkFlowControls } from "./useFlowControls";
  import colors from "@utils/colors";
  import Button from "@ui/Button.vue";
  import type { FlowSimulationControls } from "./useFlowSimulation";
  import { computed } from "vue";

  const props = defineProps<{
    simControls: FlowSimulationControls;
    controls: NetworkFlowControls;
  }>();

  const simActive = computed(() => props.simControls.isActive.value);
</script>

<template>
  <div class="flex gap-3">
    <Button
      v-if="!simActive"
      :style="{
        backgroundColor: colors.BLUE_500,
        color: colors.WHITE,
      }"
      @click="simControls.start"
    >
      Run Flow Simulation
    </Button>

    <Button
      v-else
      :style="{
        backgroundColor: colors.RED_600,
        color: colors.WHITE,
      }"
      @click="simControls.stop"
    >
      Stop Simulation
    </Button>

    <div
      v-if="!simActive"
      class="flex gap-3"
    >
      <Button
        v-if="!controls.makeSourceRejector.value"
        @click="controls.makeSource"
      >
        Switch Source
      </Button>

      <Button
        v-else
        @click="controls.makeSourceRejector.value"
        :style="{
          backgroundColor: colors.RED_500,
          color: colors.WHITE,
        }"
      >
        Cancel
      </Button>

      <Button
        v-if="!controls.makeSinkRejector.value"
        @click="controls.makeSink"
      >
        Switch Sink
      </Button>

      <Button
        v-else
        @click="controls.makeSinkRejector.value"
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
