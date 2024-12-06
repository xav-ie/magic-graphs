<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import CWell from "@ui/core/Well.vue";
  import { GWellTheme } from "./GWellTheme";

  const color = computed(() => GWellTheme[graph.value.themeName.value]);
</script>

<template>
  <CWell
    v-bind="$attrs"
    :color="color"
  >
    <slot></slot>
  </CWell>
</template>
