<script setup lang="ts">
  import { ref } from 'vue';
  import GButton from '@ui/graph/button/GButton.vue';
  import CIcon from '@ui/core/Icon.vue';
  import GDialog from '@ui/graph/GDialog.vue';
  import { onClickOutside } from '@vueuse/core';
  import HelpContent from './help/HelpContent.vue';

  const showDialog = ref(false);
  const dialogContent = ref();

  onClickOutside(dialogContent, () => {
    showDialog.value = false;
  });

  const toggleDialog = () => {
    showDialog.value = !showDialog.value;
  };
</script>

<template>
  <GButton
    @click="toggleDialog"
    class="aspect-square w-[45px]"
  >
    <CIcon icon="help"></CIcon>
  </GButton>

  <GDialog v-model:visible="showDialog">
    <div ref="dialogContent">
      <HelpContent />
    </div>
  </GDialog>
</template>
