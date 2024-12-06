<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import CRadioButton from "@ui/core/button/RadioButton.vue";
  import { GRadioButtonTheme } from "./GRadioButtonTheme";

  const theme = computed(() => GRadioButtonTheme[graph.value.themeName.value]);
</script>

<template>
  <CRadioButton
    :color="theme.color"
    :outline-color="theme.outlineColor"
    v-bind="$attrs"
  >
    <slot></slot>
  </CRadioButton>
</template>
