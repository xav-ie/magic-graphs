<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import CWell from "@ui/core/Well.vue";
  import { GWellTheme } from "./GWellTheme";

  const theme = computed(() => GWellTheme[graph.value.themeName.value]);

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
    :color="secondary ? theme.secondaryColor : theme.color"
    :text-color="theme.textColor"
  >
    <slot></slot>
  </CWell>
</template>
