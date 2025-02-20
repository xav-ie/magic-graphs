<script setup lang="ts">
  import CToolbar from '@ui/core/toolbar/ToolbarBase.vue';
  import GToolbarHint from './GToolbarHint.vue';
  import { useNonNullGraphColors } from '@graph/themes/useGraphColors';
  import type { TutorialControls } from '@graph/tutorials/types';

  const colors = useNonNullGraphColors();

  defineProps<{
    hint?: TutorialControls;
  }>();
</script>

<template>
  <CToolbar
    :hint="hint"
    :color="colors.primary"
  >
    <slot></slot>
    <template #hint>
      <GToolbarHint
        v-if="hint"
        :tutorial="hint"
      />
    </template>
  </CToolbar>
</template>
