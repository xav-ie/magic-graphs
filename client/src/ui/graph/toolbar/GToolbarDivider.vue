<script setup lang="ts">
  import { computed } from "vue";
  import CToolbarDivider from "@ui/core/toolbar/ToolbarDivider.vue";
  import { GToolbarDividerTheme } from "./GToolbarDividerTheme";
  import { graph } from "@graph/global";

  const color = computed(() => GToolbarDividerTheme[graph.value.themeName.value]);
</script>

<template>
  <CToolbarDivider
    v-bind="$props"
    :color="color"
  />
</template>
