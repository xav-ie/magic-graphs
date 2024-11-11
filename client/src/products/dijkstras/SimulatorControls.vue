<script setup lang="ts">
  import colors from "@utils/colors";
import type { DijkstraSimulatorControls } from "./useSimulator";
  import {
    mdiPlay,
    mdiPause,
    mdiRestart,
    mdiChevronLeft,
    mdiChevronRight,
  } from "@mdi/js";
  import Button from "@playground/ui/Button.vue";


  const props = defineProps<{
    controls: DijkstraSimulatorControls;
  }>();

  const prevStep = () => {
    props.controls.prevStep();
    props.controls.paused.value = true;
  };

  const nextStep = () => {
    props.controls.nextStep();
    props.controls.paused.value = true;
  };

  const togglePause = () => {
    props.controls.paused.value = !props.controls.paused.value;
  };

  const restart = () => {
    props.controls.stop();
    props.controls.start();
  };

  const btnSize = 24;
</script>

<template>
  <div
    v-if="props.controls.active.value"
    class="flex gap-[60px] text-white"
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
      v-if="!props.controls.isOver.value"
      @click="togglePause"
    >
      <svg
        :width="btnSize"
        :height="btnSize"
        :viewBox="`0 0 ${btnSize} ${btnSize}`"
      >
        <path
          :d="props.controls.paused.value ? mdiPlay : mdiPause"
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
