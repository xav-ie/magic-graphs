<script setup lang="ts">
  defineProps<{
    active?: boolean;
    disabled?: boolean;
  }>();
</script>

<template>
  <div>
    <v-icon
      :class="[
        'text-white',
        disabled ? 'text-opacity-50' : '',
        disabled ? '' : 'hover:bg-gray-900',
        'p-5',
        'rounded-md',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        active ? 'bg-gray-900' : 'bg-gray-800',
      ]"
    >
      <slot></slot>
    </v-icon>
  </div>
</template>
