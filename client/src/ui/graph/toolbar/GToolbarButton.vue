<script setup lang="ts">
  import { computed } from "vue";
  import CToolbarButton from "@ui/core/toolbar/ToolbarButton.vue";
  import { GToolbarButtonTheme } from "./GToolbarButtonTheme";
  import { graph } from "@graph/global";

  const theme = computed(() => GToolbarButtonTheme[graph.value.themeName.value]);
</script>

<template>
  <CToolbarButton
    v-bind="$props"
    :color="theme.color"
    :active-color="theme.activeColor"
  >
    <slot></slot>
  </CToolbarButton>
</template>
