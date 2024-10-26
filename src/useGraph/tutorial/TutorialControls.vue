<script setup lang="ts">
  import { computed } from "vue";
  import type { TutorialControls } from "./useTutorial";

  const { tutorial } = defineProps<{
    tutorial: TutorialControls;
  }>();

  const progress = computed(
    () =>
      `${tutorial.currentStepIndex.value + 1} / ${
        tutorial.sequence.value.length
      }`
  );
</script>

<template>
  <button
    @click="tutorial.previousStep"
    :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
  >
    <span class="select-none">Previous Step</span>
  </button>
  <button
    @click="tutorial.skipStep"
    :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
  >
    <span class="select-none">Skip Step</span>
  </button>
  <button
    @click="tutorial.endTutorial"
    :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
  >
    <span class="select-none">End Tutorial</span>
  </button>
  <button
    @click="tutorial.restartTutorial"
    :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
  >
    <span class="select-none">Restart Tutorial</span>
  </button>

  <div class="flex gap-2">
    <span class="select-none">
      step {{ progress }} -> isTutorialOver: {{ tutorial.isTutorialOver }}
    </span>
  </div>
</template>
