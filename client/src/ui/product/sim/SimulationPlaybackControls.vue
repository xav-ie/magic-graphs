<script setup lang="ts">
  import { ref, toRefs } from "vue";
  import type { SimulationControls } from "./types";
  import PlaybackButton from "./PlaybackButton.vue";
  import ProgressBar from "./Progressbar.vue";

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


  const goToStep = (step: number) => {
    setStep(step);
    paused.value = true;
  };

  const togglePause = () => {
    paused.value = !paused.value;
  };

  const restart = () => {
    stop();
    start();
  };

  const previewedProgress = ref(-1);

  const onProgressBarHover = (prog: number) => {
    previewedProgress.value = prog;
  };

  const onProgressMouseLeave = () => {
    previewedProgress.value = -1;
  }
</script>

<template>
  <div class="flex flex-col gap-5 items-center justify-center">
    <ProgressBar
      @mouseleave="onProgressMouseLeave"
      :range="[0, trace.length]"
      :progress="step"
      :on-progress-set="goToStep"
      :preview-progress="previewedProgress"
      :on-hover="onProgressBarHover"
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
