<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import CButton from "@ui/core/Button.vue";
  import { GButtonTheme } from "./GButtonTheme";

  const color = computed(() => GButtonTheme[graph.value.themeName.value]);
</script>

<template>
  <CButton :color="color">
    <slot></slot>
  </CButton>
</template>
