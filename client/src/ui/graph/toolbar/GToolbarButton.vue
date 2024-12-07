<script setup lang="ts">
  import { computed } from "vue";
  import CToolbarButton from "@ui/core/toolbar/ToolbarButton.vue";
  import { useGraphColors } from "@graph/themes/useGraphColors";
  import { graph } from "@graph/global";

  const colors = useGraphColors();

  // special case!
  const activeColor = computed(() => {
    if (graph.value.themeName.value === 'dark') {
      return colors.value.tertiary;
    }
    return colors.value.secondary;
  });
</script>

<template>
  <CToolbarButton
    v-bind="$props"
    :color="colors.primary"
    :active-color="activeColor"
  >
    <slot></slot>
  </CToolbarButton>
</template>
