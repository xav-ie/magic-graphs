<script setup lang="ts">
  import CIcon from '@ui/core/Icon.vue';

  defineProps<{
    keyboardKey: string;
  }>();
</script>

<template>
  <div :class="['border-[1px]', 'rounded-md', 'px-2', 'mx-[1px]', 'text-xs']">
    <CIcon
      v-if="keyboardKey.startsWith('mdi-')"
      :icon="keyboardKey.slice(4)"
      class="text-xs"
    />
    <p v-else>
      {{ keyboardKey }}
    </p>
  </div>
</template>
