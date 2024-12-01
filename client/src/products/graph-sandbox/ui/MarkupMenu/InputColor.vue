<script setup lang="ts">
  import { MARKUP_COLORS } from "@product/graph-sandbox/constants";
  import type { Color } from "@utils/colors";
  import ButtonGroup from "./ButtonGroup.vue";
  import Button from "./Button.vue";

  const activeColor = defineModel<Color>();
</script>

<template>
  <ButtonGroup>
    <Button
      v-for="color in MARKUP_COLORS"
      @click="activeColor = color"
      :key="color"
      :active="activeColor === color"
    >
      <div :class="[`bg-[${color}]`, 'w-full', 'h-full', 'rounded-md']"></div>
    </Button>
  </ButtonGroup>
</template>
