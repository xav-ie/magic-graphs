<script setup lang="ts">
  import { computed } from "vue";
  import CToolbarButton from "@ui/core/toolbar/ToolbarButton.vue";
  import { GToolbarButtonTheme } from "./GToolbarButtonTheme";
  import { graph } from "@graph/global";

  const color = computed(() => GToolbarButtonTheme[graph.value.themeName.value]);
</script>

<template>
  <CToolbarButton
    v-bind="$props"
    :color="color"
  >
    <slot></slot>
  </CToolbarButton>
</template>
