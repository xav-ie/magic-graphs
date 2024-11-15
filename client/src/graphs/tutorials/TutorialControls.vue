<script setup lang="ts">
  import type { TutorialControls } from "@graph/tutorials/types";

  const { tutorial } = defineProps<{
    tutorial: TutorialControls;
  }>();
</script>

<template>
  <button
    @click="tutorial.prevStep"
    :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
  >
    <span class="select-none">Previous Step</span>
  </button>
  <button
    @click="tutorial.nextStep"
    :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
  >
    <span class="select-none">Next Step</span>
  </button>
  <button
    @click="tutorial.stop"
    :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
  >
    <span class="select-none">End Tutorial</span>
  </button>
  <button
    @click="tutorial.start"
    :class="`bg-blue-600 text-white px-3 py-1 rounded-lg font-bold`"
  >
    <span class="select-none">Restart Tutorial</span>
  </button>
</template>
