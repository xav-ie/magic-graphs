<script setup lang="ts">
  import ButtonGroup from "./ButtonGroup.vue";
  import Button from "./Button.vue";
  import colors from "@utils/colors";
  import type { Color } from "@utils/colors";

  const COLOR_PALETTE = [
    colors.BLACK,
    colors.BLUE_600,
    colors.RED_600,
    colors.GREEN_600,
    colors.YELLOW_600,
  ];

  const activeColor = defineModel<Color>();
</script>

<template>
  <ButtonGroup>
    <Button
      v-for="color in COLOR_PALETTE"
      @click="activeColor = color"
      :key="color"
      :active="activeColor === color"
    >
      <div :class="[`bg-[${color}]`, 'w-full', 'h-full', 'rounded-md']"></div>
    </Button>
  </ButtonGroup>
</template>
