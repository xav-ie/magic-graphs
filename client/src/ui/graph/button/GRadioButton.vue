<script setup lang="ts">
  import CRadioButton from "@ui/core/button/RadioButton.vue";
  import { useGraphColors } from "@graph/themes/useGraphColors";

  const colors = useGraphColors();
</script>

<template>
  <CRadioButton
    v-bind="$attrs"
    :color="colors.secondary"
    :outline-color="colors.text"
  >
    <slot></slot>
  </CRadioButton>
</template>
