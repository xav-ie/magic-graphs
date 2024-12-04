<script setup lang="ts">
  import CIcon from "@ui/core/Icon.vue";

  defineProps<{
    active?: boolean;
    disabled?: boolean;
    icon?: string;
  }>();
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'p-1',
      'rounded-md',
      'grid',
      'place-items-center',
      'w-10',
      'h-10',
      disabled ? 'opacity-50' : '',
      disabled ? '' : 'hover:bg-gray-900',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      active ? 'bg-gray-900' : 'bg-gray-800',
    ]"
  >
    <slot>
      <c-icon
        :icon="icon ?? ''"
        class="text-white"
      />
    </slot>
  </button>
</template>
