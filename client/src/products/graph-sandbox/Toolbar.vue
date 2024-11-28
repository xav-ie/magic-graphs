<script setup lang="ts">
import type { TutorialControls } from '@graph/tutorials/types';
import ToolbarHint from './ToolbarHint.vue';

defineProps<{
  hint?: TutorialControls;
}>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2 bg-gray-800 py-1 px-1 rounded-lg">
      <slot></slot>
    </div>
    <ToolbarHint
      v-if="hint"
      :tutorial="hint"
    />
  </div>
</template>
