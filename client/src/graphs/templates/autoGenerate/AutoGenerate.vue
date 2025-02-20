<script setup lang="ts">
  import GButton from '@ui/graph/button/GButton.vue';
  import CIcon from '@ui/core/Icon.vue';
  import { useAutoGenerate } from './useAutoGenerate';
  import { nonNullGraph as graph } from '@graph/global';
  import AutoGenerateSettingsMenu from './AutoGenerateSettingsMenu.vue';

  const { generate, options } = useAutoGenerate(graph.value);
</script>

<template>
  <div class="flex justify-between gap-2">
    <GButton
      @click="generate"
      class="flex-grow"
    >
      <CIcon icon="plus"></CIcon>
      Generate New
    </GButton>
    <AutoGenerateSettingsMenu :options="options" />
  </div>
</template>
