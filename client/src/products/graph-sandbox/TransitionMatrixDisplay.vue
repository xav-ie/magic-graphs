<script setup lang="ts">
import type { TransitionMatrix } from '@graph/useTransitionMatrix';

defineProps<{
  transitionMatrix: TransitionMatrix;
}>();
</script>

<template>
  <div class="flex py-6 justify-center">
    <div class="border-x-4 py-6 px-2">
      <div v-for="row in transitionMatrix" class="flex gap-5 justify-center">
        <div v-for="col in row" class="text-opacity-50 text-white text-md font-bold text-center w-8" style="overflow: hidden;">{{ col }}</div>
      </div>
    </div>
  </div>
</template>
