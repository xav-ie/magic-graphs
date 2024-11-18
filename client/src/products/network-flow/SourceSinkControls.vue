<script setup lang="ts">
  import { computed } from "vue";
  import Button from "@ui/Button.vue";
  import colors from "@utils/colors";
  import type { SourceSinkControls } from "./useSourceSinkControls";
  import type { FlowSimulationControls } from "./useFlowSimulation";

  const props = defineProps<{
    simControls: FlowSimulationControls;
    sourceSink: SourceSinkControls;
  }>();

  const simActive = computed(() => props.simControls.isActive.value);
</script>

<template>
  <div class="flex gap-3">
    <Button
      v-if="!simActive"
      @click="simControls.start"
      :style="{
        backgroundColor: colors.BLUE_500,
        color: colors.WHITE,
      }"
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
        v-if="!sourceSink.cancelSetSourceNode.value"
        @click="sourceSink.setSourceNode"
      >
        Switch Source
      </Button>

      <Button
        v-else
        @click="sourceSink.cancelSetSourceNode.value"
        :style="{
          backgroundColor: colors.RED_500,
          color: colors.WHITE,
        }"
      >
        Cancel
      </Button>

      <Button
        v-if="!sourceSink.cancelSetSinkNode.value"
        @click="sourceSink.setSinkNode"
      >
        Switch Sink
      </Button>

      <Button
        v-else
        @click="sourceSink.cancelSetSinkNode.value"
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
