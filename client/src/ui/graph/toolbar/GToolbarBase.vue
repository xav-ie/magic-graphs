<script setup lang="ts">
  import { computed } from "vue";
  import CToolbar from "@ui/core/toolbar/Toolbar.vue";
  import { GToolbarBaseTheme } from "./GToolbarBaseTheme";
  import { graph } from "@graph/global";

  const color = computed(() => GToolbarBaseTheme[graph.value.themeName.value]);
</script>

<template>
  <CToolbar
    v-bind="$props"
    :color="color"
  >
    <slot></slot>
  </CToolbar>
</template>
