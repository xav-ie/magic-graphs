<script setup lang="ts">
  import type { FlowSimulationControls } from "./useFlowSimulation";
  import Button from "@playground/ui/Button.vue";
  import {
    mdiPlay,
    mdiPause,
    mdiRestart,
    mdiChevronLeft,
    mdiChevronRight,
  } from "@mdi/js";

  const props = defineProps<{
    simControls: FlowSimulationControls;
  }>();

  const nextStep = () => {
    props.simControls.nextStep();
    props.simControls.simulationPaused.value = true;
  };

  const prevStep = () => {
    props.simControls.prevStep();
    props.simControls.simulationPaused.value = true;
  };

  const togglePause = () => {
    props.simControls.simulationPaused.value =
      !props.simControls.simulationPaused.value;
  };

  const restart = () => {
    props.simControls.stopSimulation();
    props.simControls.startSimulation();
  };

  const btnSize = 24;
</script>

<template>
  <div
    v-if="props.simControls.simulationActive.value"
    class="flex gap-[60px]"
  >
    <Button
      @click="prevStep"
      style="border-radius: 100px; transform: scale(2)"
    >
      <svg
        :width="btnSize"
        :height="btnSize"
        :viewBox="`0 0 ${btnSize} ${btnSize}`"
      >
        <path :d="mdiChevronLeft" />
      </svg>
    </Button>

    <Button
      style="border-radius: 100px; transform: scale(2)"
      v-if="!props.simControls.isSimulationOver.value"
      @click="togglePause"
    >
      <svg
        :width="btnSize"
        :height="btnSize"
        :viewBox="`0 0 ${btnSize} ${btnSize}`"
      >
        <path
          :d="props.simControls.simulationPaused.value ? mdiPlay : mdiPause"
        />
      </svg>
    </Button>

    <Button
      v-else
      style="border-radius: 100px; transform: scale(2)"
      @click="restart"
    >
      <svg
        :width="btnSize"
        :height="btnSize"
        :viewBox="`0 0 ${btnSize} ${btnSize}`"
      >
        <path :d="mdiRestart" />
      </svg>
    </Button>

    <Button
      style="border-radius: 100px; transform: scale(2)"
      @click="nextStep"
    >
      <svg
        :width="btnSize"
        :height="btnSize"
        :viewBox="`0 0 ${btnSize} ${btnSize}`"
      >
        <path :d="mdiChevronRight" />
      </svg>
    </Button>
  </div>
</template>
