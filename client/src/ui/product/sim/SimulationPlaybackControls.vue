<script setup lang="ts">
  import { toRefs } from "vue";
  import type { SimulationControls } from "./types";
  import ProgressBar from "./ProgressBar.vue";
  import PlaybackButton from "./PlaybackButton.vue";

  const props = defineProps<{
    controls: { value: SimulationControls };
  }>();

  const { isOver, paused, step, trace, hasBegun } = toRefs(
    props.controls.value
  );
  const { nextStep, prevStep, setStep, start, stop } = props.controls.value;

  const goPrevStep = () => {
    prevStep();
    paused.value = true;
  };

  const goNextStep = () => {
    nextStep();
    paused.value = true;
  };

  const goToStep = (newStep: number) => {
    setStep(newStep);
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
      :on-progress-set="goToStep"
      class="w-full border-gray-200 border-2 rounded-lg"
    />

    <div class="flex gap-4 fill-white dark:fill-black">
      <PlaybackButton
        @click="goPrevStep"
        :disabled="!hasBegun"
      >
        mdi-chevron-left
      </PlaybackButton>

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

      <PlaybackButton
        @click="goNextStep"
        :disabled="isOver"
      >
        mdi-chevron-right
      </PlaybackButton>
    </div>
  </div>
</template>
