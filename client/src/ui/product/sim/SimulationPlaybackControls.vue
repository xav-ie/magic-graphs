<script setup lang="ts">
  import { onUnmounted, ref, toRefs } from "vue";
  import type { UnwrapRef } from "vue";
  import { graph } from "@graph/global";
  import type { SimulationControls } from "./types";
  import PlaybackButton from "./PlaybackButton.vue";
  import ProgressBar from "./ProgressBar.vue";

  const props = defineProps<{
    controls: UnwrapRef<SimulationControls>;
  }>();

  const { isOver, paused, step, hasBegun, lastStep } = toRefs(
    props.controls
  );

  const { nextStep, prevStep, setStep, start, stop } = props.controls;

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

  const pause = () => {
    paused.value = true;
  };

  graph.value.subscribe('onStructureChange', pause);

  onUnmounted(() => {
    graph.value.unsubscribe('onStructureChange', pause);
  });
</script>

<template>
  <div class="flex flex-col gap-5 items-center justify-center">
    <ProgressBar
      @mouseleave="onProgressMouseLeave"
      :range="[0, lastStep]"
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
        icon="chevron_left"
      />

      <PlaybackButton
        v-if="isOver"
        @click="restart"
        icon="restart_alt"
      />

      <PlaybackButton
        v-else
        @click="togglePause"
        :icon="paused ? 'play_arrow' : 'pause'"
      />

      <PlaybackButton
        @click="goNextStep"
        :disabled="isOver"
        icon="chevron_right"
      />
    </div>
  </div>
</template>
