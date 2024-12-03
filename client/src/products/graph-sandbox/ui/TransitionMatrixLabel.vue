<script setup lang="ts">
  import type { GNode } from "@graph/types";
  import GraphNode from "@ui/graph/GraphNode.vue";

  defineProps<{
    toNode: GNode;
    fromNode: GNode;
    weight: number;
  }>();
</script>

<template>
  <div
    class="text-gray-300 text-sm font-bold text-center flex items-center justify-center overflow-hidden w-12 h-12"
  >
    {{ weight }}
    <v-tooltip
      activator="parent"
      location="top"
      color="red-lighten-2"
    >
      <div class="flex gap-1 items-center">
        <GraphNode :size="30">
          {{ toNode.label }}
        </GraphNode>
        <v-icon :size="16">mdi-arrow-right</v-icon>
        <GraphNode :size="30">
          {{ fromNode.label }}
        </GraphNode>
      </div>
    </v-tooltip>
  </div>
</template>