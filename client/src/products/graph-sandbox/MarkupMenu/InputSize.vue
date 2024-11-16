<script setup lang="ts">
  import ButtonGroup from "./ButtonGroup.vue";
  import Button from "./Button.vue";
  import { MARKUP_SIZES } from "../types";
  import type { MarkupSize } from "../types";

  const SIZES = MARKUP_SIZES;

  const activeSize = defineModel<MarkupSize>();
</script>

<template>
  <ButtonGroup>
    <Button
      v-for="size in SIZES"
      @click="activeSize = size"
      :key="size"
      :active="activeSize === size"
    >

        {{ size }}

    </Button>
  </ButtonGroup>
</template>
