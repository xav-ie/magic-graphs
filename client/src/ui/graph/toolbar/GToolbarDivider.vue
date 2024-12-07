<script setup lang="ts">
  import CToolbarDivider from "@ui/core/toolbar/ToolbarDivider.vue";
  import { useGraphColors } from "@graph/themes/useGraphColors";

  const colors = useGraphColors();
</script>

<template>
  <CToolbarDivider
    v-bind="$props"
    :color="colors.text + '30'"
  />
</template>
