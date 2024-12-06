<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import CRadioButton from "@ui/core/button/RadioButton.vue";
  import { GRadioButtonTheme } from "./GRadioButtonTheme";

  const theme = computed(() => GRadioButtonTheme[graph.value.themeName.value]);
</script>

<template>
  <CRadioButton
    v-bind="$attrs"
    :color="theme.color"
    :outline-color="theme.outlineColor"
  >
    <slot></slot>
  </CRadioButton>
</template>
