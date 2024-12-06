<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import { GNodeTheme } from "./GNodeTheme";

  type NodeProps = {
    size?: number;
    borderSize?: number;
  };

  const theme = computed(() => GNodeTheme[graph.value.themeName.value]);

  const props = withDefaults(defineProps<NodeProps>(), {
    size: 60,
  });

  const borderSize = computed(() =>
    Math.round(Math.max(1, Math.log(props.size)))
  );
</script>

<template>
  <div
    :class="[
      'flex',
      'font-bold',
      'items-center',
      'justify-center',
      'rounded-full',
    ]"
    :style="{
      color: theme.textColor,
      border: `${borderSize}px solid ${theme.textColor}`,
      backgroundColor: theme.color,
      height: `${size}px`,
      width: `${size}px`,
    }"
  >
    <slot></slot>
  </div>
</template>
