<script setup lang="ts">
  import { toRefs } from "vue";
  import type { SimulationControls } from "./types";
  import ProgressBar from "./ProgressBar.vue";
  import PlaybackButton from "./PlaybackButton.vue";

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
</script>

<template>
  <div class="flex flex-col gap-5 items-center justify-center">
    <ProgressBar
      :range="[-1, trace.length]"
      :progress="step"
      :on-progress-set="setStep"
      class="w-full border-gray-200 border-2 rounded-lg"
    />

    <div class="flex gap-4 fill-white dark:fill-black">
      <PlaybackButton @click="goPrevStep">mdi-chevron-left</PlaybackButton>

      <PlaybackButton
        v-if="isOver"
        @click="restart"
      >
        mdi-restart
      </PlaybackButton>

      <PlaybackButton
        v-else
        @click="togglePause"
      >
        {{ paused ? "mdi-play" : "mdi-pause" }}
      </PlaybackButton>

      <PlaybackButton @click="goNextStep">mdi-chevron-right</PlaybackButton>
    </div>
  </div>
</template>
