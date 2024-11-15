<script setup lang="ts">
  defineProps<{
    active?: boolean;
    disabled?: boolean;
  }>();
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'text-white',
      'p-2',
      'rounded-md',
      disabled ? 'text-opacity-50' : '',
      disabled ? '' : 'hover:bg-gray-900',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      active ? 'bg-gray-900' : 'bg-gray-800',
    ]"
  >
    <v-icon>
      <slot></slot>
    </v-icon>
  </button>
</template>
