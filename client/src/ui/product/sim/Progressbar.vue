<script setup lang="ts">
import { computed, ref } from "vue";
import { PROGRESS_DEFAULTS } from "./progressTypes";
import type { ProgressOptions } from "./progressTypes";

const props = withDefaults(defineProps<ProgressOptions>(), PROGRESS_DEFAULTS);

const range = computed(() => {
  const [start, end] = props.range;
  return end - start;
});

const progressPercentage = computed(() => {
  const [start] = props.range;
  const curr = props.progress;

  const progress = Math.min(Math.max(curr - start, 0), range.value);
  return (progress / range.value) * 100;
});

const hoverStep = ref<number | null>(null);
const savedStep = ref<number | null>(null);

const updateProgressFromMouseMove = (event: MouseEvent) => {
  const progressBar = event.currentTarget;
  if (!(progressBar instanceof HTMLElement)) return;

  const clickPosition = event.offsetX;
  const progressBarWidth = progressBar.offsetWidth;

  const clickPercentage = clickPosition / progressBarWidth;
  const newProgress = props.range[0] + clickPercentage * range.value;

  const newStep = Math.round(newProgress);
  if (hoverStep.value === null) savedStep.value = newStep;
  hoverStep.value = newStep;

  props.onProgressSet?.(newStep);
};

const clearHoverPreview = () => {
  if (savedStep.value !== null) {
    props.onProgressSet?.(savedStep.value);
    hoverStep.value = savedStep.value;
  } else {
    hoverStep.value = null;
  }
};

const handleClick = () => {
  if (hoverStep.value !== null) {
    savedStep.value = hoverStep.value;
  }
};
</script>

<template>
  <div @mousemove="updateProgressFromMouseMove" @mouseleave="clearHoverPreview" @click="handleClick"
    class="relative overflow-hidden h-4 w-full z-1">
    <div :class="`absolute top-0 left-0 h-full z-0`" :style="{
      backgroundColor: props.color,
      width: `${progressPercentage}%`,
      transition: `width ${props.transitionTimeMs}ms ${props.transitionEasing}`,
    }"></div>
  </div>
</template>
