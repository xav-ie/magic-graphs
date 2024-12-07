<script setup lang="ts">
  import { useGraphColors } from "@graph/themes/useGraphColors";
  import CWell from "@ui/core/Well.vue";

  const colors = useGraphColors();

  withDefaults(defineProps<{
    /**
     * true if the well should use the secondary color
     * as the background color.
     */
    secondary?: boolean;
  }>(), {
    secondary: false,
  })
</script>

<template>
  <CWell
    v-bind="$attrs"
    :color="secondary ? colors.secondary : colors.primary"
    :text-color="colors.text"
  >
    <slot></slot>
  </CWell>
</template>
