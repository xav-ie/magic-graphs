<script setup lang="ts">
  import {
    mdiPlay,
    mdiPause,
    mdiRestart,
    mdiChevronLeft,
    mdiChevronRight,
  } from "@mdi/js";
  import Button from "@ui/Button.vue";
  import type { SimulationControls } from "./types";
  import { toRefs } from "vue";

  const props = defineProps<{
    controls: SimulationControls;
  }>();

  const { isOver, paused } = toRefs(props.controls);

  const prevStep = () => {
    props.controls.prevStep();
    paused.value = true;
  };

  const nextStep = () => {
    props.controls.nextStep();
    paused.value = true;
  };

  const togglePause = () => {
    paused.value = !paused.value;
  };

  const restart = () => {
    props.controls.stop();
    props.controls.start();
  };

  const btnSize = 24;
</script>

<template>
  <div class="flex gap-[60px] fill-white dark:fill-black">
    <Button
      @click="prevStep"
      style="border-radius: 100px; transform: scale(2)"
    >
      <svg
        :width="btnSize"
        :height="btnSize"
        :viewBox="`0 0 ${btnSize} ${btnSize}`"
      >
        <path :d="mdiChevronLeft"  />
      </svg>
    </Button>

    <Button
      v-if="isOver"
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
      v-else
      @click="togglePause"
    >
      <svg
        :width="btnSize"
        :height="btnSize"
        :viewBox="`0 0 ${btnSize} ${btnSize}`"
      >
        <path :d="paused ? mdiPlay : mdiPause" />
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
