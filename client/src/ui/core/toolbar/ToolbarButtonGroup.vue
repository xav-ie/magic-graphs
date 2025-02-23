<script setup lang="ts">
  import { computed } from 'vue';
  import { twMerge } from 'tailwind-merge';
  import { useClassAttrs } from '@ui/useClassAttrs';

  const parentClasses = useClassAttrs();
  const defaultClasses = ['flex', 'items-center', 'relative', 'gap-1'];
  const classes = computed(() => twMerge(defaultClasses, parentClasses.value));
</script>

<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>
