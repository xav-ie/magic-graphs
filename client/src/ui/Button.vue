<script setup lang="ts">
  import { computed } from 'vue';
  import type { StyleValue } from 'vue';

  const props = defineProps<{
    /**
     * The color of the button.
     */
    color?: string;
    /**
     * The text color of the button.
     */
    textColor?: string;
  }>();

  const styling = computed(() => {
    const style: StyleValue = {}
    if (props.color) style['backgroundColor'] = props.color;
    if (props.textColor) style['color'] = props.textColor;
    return style;
  });
</script>

<template>
  <button
    :class="[
      'px-2',
      'py-1',

      'bg-gray-800',
      'text-gray-200',

      'dark:bg-gray-200',
      'dark:text-gray-800',

      'hover:bg-gray-700',
      'dark:hover:bg-gray-300',

      'rounded-md',
      'cursor-pointer',
      'font-bold',
      'flex',
      'items-center',
      'justify-center',
    ]"

    :style="styling"
  >
    <slot></slot>
  </button>
</template>
