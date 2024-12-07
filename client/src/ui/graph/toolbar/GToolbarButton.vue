<script setup lang="ts">
  import { computed } from "vue";
  import CToolbarButton from "@ui/core/toolbar/ToolbarButton.vue";
  import { graph } from "@graph/global";
  import { useGraphColors } from "@graph/themes/useGraphColors";

  const colors = useGraphColors();
</script>

<template>
  <CToolbarButton
    v-bind="$props"
    :color="colors.primary"
    :active-color="colors.tertiary"
  >
    <slot></slot>
  </CToolbarButton>
</template>
