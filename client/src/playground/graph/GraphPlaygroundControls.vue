<script setup lang="ts">
import InputCheckbox from '@playground/ui/InputCheckbox.vue';
import type { GraphPlaygroundControls } from './types';
import { capitalize } from '@utils/string';

defineProps<{
  playgroundControls: GraphPlaygroundControls;
}>();
</script>

<template>
  <div
    v-for="(_, controlName) in playgroundControls"
    class="flex gap-3 items-center pl-3 py-2 hover:bg-gray-800 cursor-pointer"
    @click="playgroundControls[controlName] = !playgroundControls[controlName]"
  >
    <InputCheckbox
      v-model="playgroundControls[controlName]"
      class="h-6 w-6 rounded-xl cursor-pointer"
    />
    <h2 class="text-white font-bold">
      {{ capitalize(controlName) }}
    </h2>
  </div>
</template>