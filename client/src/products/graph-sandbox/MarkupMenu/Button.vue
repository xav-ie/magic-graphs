<script setup lang="ts">
  defineProps<{
    active: boolean;
  }>();
</script>

<template>
  <button
    :class="[
      'cursor-pointer',
      'rounded-xl',
      'p-1',
      'border-2',
      active ? 'border-white' : 'border-transparent',
      active ? 'hover:border-white' : 'hover:border-gray-400',
    ]"
  >
    <div :class="['relative', 'w-8', 'h-8', 'rounded-md']">
      <slot></slot>
    </div>
  </button>
</template>
