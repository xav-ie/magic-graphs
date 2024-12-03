<script setup lang="ts">
  import { computed } from "vue";
  import colors from "@utils/colors";

  type NodeProps = {
    size?: number;
    borderSize?: number;
    color?: string;
  };

  const props = withDefaults(defineProps<NodeProps>(), {
    size: 60,
    color: colors.WHITE,
  });

  const borderSize = computed(() => Math.round(Math.max(1, Math.log(props.size))));
</script>

<template>
  <div
    :class="[
      'flex',
      'font-bold',
      'items-center',
      'justify-center',
      `border-[${borderSize}px]`,
      `border-[${color}]`,
      `text-[${color}]`,
      'rounded-full',
      `h-[${size}px]`,
      `w-[${size}px]`,
    ]"
  >
    <slot></slot>
  </div>
</template>
