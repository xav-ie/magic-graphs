<script setup lang="ts">
  import { toRefs } from "vue";
  import {
    mdiPlay,
    mdiPause,
    mdiRestart,
    mdiChevronLeft,
    mdiChevronRight,
  } from "@mdi/js";
  import Button from "@ui/Button.vue";
  import type { SimulationControls } from "./types";
  import ProgressBar from "./ProgressBar.vue";

  const props = defineProps<{
    controls: SimulationControls;
  }>();

  const { isOver, paused, step, trace } = toRefs(props.controls);
  const { nextStep, prevStep, setStep, start, stop } = props.controls;

  const goPrevStep = () => {
    prevStep();
    paused.value = true;
  };

  const goNextStep = () => {
    nextStep();
    paused.value = true;
  };

  const togglePause = () => {
    paused.value = !paused.value;
  };

  const restart = () => {
    stop();
    start();
  };

  const btnSize = 24;
</script>

<template>
  <div class="w-[280px] flex flex-col items-center justify-center">
    <ProgressBar
      :range="[-1, trace.length]"
      :progress="step"
      :on-progress-set="setStep"
      class="w-full border-gray-200 border-2 mb-8 rounded-lg"
    />

    <div class="flex gap-[60px] fill-white dark:fill-black">
      <Button
        @click="goPrevStep"
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
        @click="goNextStep"
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
  </div>
</template>
