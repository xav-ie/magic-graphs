<script setup lang="ts">
  import { onUnmounted, ref, toRefs } from "vue";
  import type { UnwrapRef } from "vue";
  import { graph } from "@graph/global";
  import type { SimulationControls } from "./types";
  import PlaybackButton from "./PlaybackButton.vue";
  import ProgressBar from "./Progressbar.vue";
  import { useGraphColors } from "@graph/themes/useGraphColors";
  import GSpreadSelect from "@ui/graph/select/GSpreadSelect.vue";
  import { DEFAULT_PLAYBACK_SPEED } from "./useSimulationControls";

  const colors = useGraphColors();

  const props = defineProps<{
    controls: UnwrapRef<SimulationControls>;
  }>();

  const { isOver, paused, step, hasBegun, lastStep, playbackSpeed } = toRefs(
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
  };

  const pause = () => {
    paused.value = true;
  };

  graph.value.subscribe("onStructureChange", pause);

  onUnmounted(() => {
    graph.value.unsubscribe("onStructureChange", pause);
  });

  const PLAYBACK_SPEEDS = [
    {
      label: "0.25x",
      value: DEFAULT_PLAYBACK_SPEED / 0.25,
    },
    {
      label: "0.5x",
      value: DEFAULT_PLAYBACK_SPEED / 0.5,
    },
    {
      label: "1x",
      value: DEFAULT_PLAYBACK_SPEED,
    },
    {
      label: "2x",
      value: DEFAULT_PLAYBACK_SPEED / 2,
    },
    {
      label: "4x",
      value: DEFAULT_PLAYBACK_SPEED / 4,
    },
  ] as const;
</script>

<template>
  <div class="flex flex-col gap-5 items-center justify-center">
    <GSpreadSelect
      v-model="playbackSpeed"
      :items="PLAYBACK_SPEEDS"
      :initial-item-index="2"
    ></GSpreadSelect>

    <ProgressBar
      @mouseleave="onProgressMouseLeave"
      :range="[0, lastStep]"
      :progress="step"
      :on-progress-set="goToStep"
      :preview-progress="previewedProgress"
      :on-hover="onProgressBarHover"
      class="w-full border-2 rounded-lg"
      :style="{ borderColor: colors.tertiary }"
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
