<script setup lang="ts">
  import { computed } from "vue";
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

  const updateProgressFromClick = (event: MouseEvent) => {
    const progressBar = event.currentTarget;
    if (!(progressBar instanceof HTMLElement)) return;

    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.offsetWidth;

    const clickPercentage = clickPosition / progressBarWidth;

    const [start] = props.range;
    const newProgress = start + clickPercentage * range.value;

    const newStep = Math.round(newProgress);
    props.onProgressSet?.(newStep);
  };
</script>

<template>
  <div
    @click="updateProgressFromClick"
    class="relative overflow-hidden h-4 w-full"
  >
    <div
      :class="`absolute top-0 left-0 h-full cursor-pointer bg-[${props.color}]`"
      :style="{
        width: `${progressPercentage}%`,
        transition: `width ${props.transitionTimeMs}ms ${props.transitionEasing}`,
      }"
    ></div>
  </div>
</template>
