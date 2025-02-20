<script setup lang="ts">
  import GButton from '@ui/graph/button/GButton.vue';
  import CIcon from '@ui/core/Icon.vue';

  defineProps<{
    icon: string;
  }>();
</script>

<template>
  <GButton style="border-radius: 40px">
    <CIcon
      class="py-1 px-6 text-5xl"
      :icon="icon"
    />
  </GButton>
</template>
