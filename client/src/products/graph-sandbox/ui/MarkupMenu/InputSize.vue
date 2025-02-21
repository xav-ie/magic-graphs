<script setup lang="ts">
  import { MARKUP_SIZES } from '@product/graph-sandbox/constants';
  import type { MarkupSize } from '@product/graph-sandbox/types';
  import ButtonGroup from './ButtonGroup.vue';
  import GRadioButton from '@ui/graph/button/GRadioButton.vue';

  const activeSize = defineModel<MarkupSize>();
</script>

<template>
  <ButtonGroup>
    <GRadioButton
      v-for="size in MARKUP_SIZES"
      @click="activeSize = size"
      :key="size"
      :active="activeSize === size"
    >
      {{ size }}
    </GRadioButton>
  </ButtonGroup>
</template>
