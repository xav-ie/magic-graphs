<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import { resolveThemeForNode } from '@graph/themes'
import type { GNode } from "@graph/types";

  type NodeProps = {
    size?: number;
    borderSize?: number;
    node: GNode
  };

  
  const props = withDefaults(defineProps<NodeProps>(), {
    size: 60,
  });
  
  const theme = resolveThemeForNode(graph.value.getTheme, props.node);

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
      color: theme.nodeTextColor,
      border: `${borderSize}px solid ${theme.nodeBorderColor}`,
      backgroundColor: theme.nodeColor,
      height: `${size}px`,
      width: `${size}px`,
    }"
  >
    <slot>
      {{ node.label }}
    </slot>
  </div>
</template>
