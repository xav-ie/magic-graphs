<script setup lang="ts">
  import { MARKUP_COLORS } from "@product/graph-sandbox/constants";
  import type { Color } from "@utils/colors";
  import ButtonGroup from "./ButtonGroup.vue";
  import RadioButton from "@ui/core/button/RadioButton.vue";

  const activeColor = defineModel<Color>();
</script>

<template>
  <ButtonGroup>
    <RadioButton
      v-for="color in MARKUP_COLORS"
      @click="activeColor = color"
      :key="color"
      :active="activeColor === color"
      :color="color"
    ></RadioButton>
  </ButtonGroup>
</template>
