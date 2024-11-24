<script setup lang="ts">
  type NodeProps = {
    size?: number;
  };

  withDefaults(defineProps<NodeProps>(), {
    size: 60,
  });
</script>

<template>
  <div
    :class="[
      'flex',
      'font-bold',
      'items-center',
      'justify-center',
      'border-4',
      'border-white',
      'rounded-full',
      `h-[${size}px]`,
      `w-[${size}px]`,
    ]"
  >
    <slot></slot>
  </div>
</template>
