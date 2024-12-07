<script setup lang="ts">
  import CButton from "@ui/core/button/Button.vue";
  import { useGraphColors } from "@graph/themes/useGraphColors";

  const colors = useGraphColors();
</script>

<template>
  <CButton :color="colors.primary">
    <slot></slot>
  </CButton>
</template>
