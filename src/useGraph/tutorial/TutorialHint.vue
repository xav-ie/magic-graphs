<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import type { TutorialControls } from "./useTutorial";

  const { tutorial } = defineProps<{
    tutorial: TutorialControls;
  }>();

  const opacity = ref(0);

  const hint = computed(() => tutorial.currentStep.value?.hint ?? "");
  const displayedHint = ref("");

  const transitionDurationMs = 1000;

  let activeTimeout: NodeJS.Timeout;

  watch(
    hint,
    () => {
      opacity.value = 0;
      clearTimeout(activeTimeout);
      activeTimeout = setTimeout(() => {
        displayedHint.value = hint.value;
        opacity.value = 1;
      }, transitionDurationMs);
    },
    { immediate: true }
  );
</script>

<template>
  <div
    :class="['transition-opacity', `duration-[${transitionDurationMs}]`]"
    :style="{
      opacity,
    }"
  >
    <h1 class="text-3xl color-green-500">
      {{ displayedHint }}
    </h1>
  </div>
</template>
