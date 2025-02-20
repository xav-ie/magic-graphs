<script setup lang="ts">
  import CToolbarDivider from '@ui/core/toolbar/ToolbarDivider.vue';
  import { useNonNullGraphColors } from '@graph/themes/useGraphColors';

  const colors = useNonNullGraphColors();
</script>

<template>
  <CToolbarDivider
    v-bind="$props"
    :color="colors.text + '30'"
  />
</template>
