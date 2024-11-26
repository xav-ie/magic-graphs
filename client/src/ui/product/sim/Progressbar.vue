<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { ProgressOptions } from "./types";
import { PROGRESS_DEFAULTS } from "./types";
import { debounce } from "@utils/debounce";

const props = defineProps<ProgressOptions>();

const backgroundColor = props.theme?.backgroundColor || PROGRESS_DEFAULTS.backgroundColor;

const progressColor = props.theme?.progressColor || PROGRESS_DEFAULTS.progressColor;

const easeTime = props.theme?.easeTime || PROGRESS_DEFAULTS.easeTime;

const progressEasing = props.theme?.progressEasing || PROGRESS_DEFAULTS.progressEasing;

const borderRadius = props.theme?.borderRadius || PROGRESS_DEFAULTS.borderRadius;

const animatedProgress = ref(0);

const progressPercentage = computed(() => {
  const range = props.endProgress - props.startProgress;
  const clampedProgress = Math.min(
    Math.max(props.currentProgress - props.startProgress, 0),
    range
  );
  return (clampedProgress / range) * 100;
});

const updateProgressFromClick = (event: MouseEvent) => {
  const progressBar = event.currentTarget as HTMLElement;
  const clickPosition = event.offsetX; 
  const progressBarWidth = progressBar.offsetWidth;
  const clickPercentage = clickPosition / progressBarWidth;

  const range = props.endProgress - props.startProgress;
  const newProgress = props.startProgress + clickPercentage * range;

  props.setProgress(Math.round(newProgress))
}

watch(
  () => progressPercentage.value,
  (newProgress) => {
    animatedProgress.value = newProgress;
  },
  { immediate: true }
);
</script>


<template>
  <div
    @click="updateProgressFromClick"
    class="relative overflow-hidden h-[25px] w-full"
    :style="{
      backgroundColor,
      borderRadius: `${borderRadius}px`,
    }"
  >
    <div
      class="absolute top-0 left-0 h-[25px] w-full"
      :style="{
        width: `${animatedProgress}%`,
        backgroundColor: progressColor,
        transition: `width ${easeTime}ms ${progressEasing}`,
      }"
    ></div>
  </div>
</template>
