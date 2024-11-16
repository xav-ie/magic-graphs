<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import { useMarkupColorizer } from "./useMarkupColorizer";
  import { useMarkupSizer } from "./useMarkupSizer";
  import NodeEdgeColorInput from "./MarkupMenu/NodeEdgeColorInput.vue";
  import NodeEdgeSizeInput from "./MarkupMenu/NodeEdgeSizeInput.vue";

  const props = defineProps<{
    graph: Graph;
  }>();

  const { colorize, colorMap } = useMarkupColorizer(props.graph);
  colorize();

  const { size, sizeMap } = useMarkupSizer(props.graph);
  size();
</script>

<template>
  <div
    v-if="props.graph.focusedItemIds.value.size > 0"
    class="flex flex-col gap-3"
  >
    <div class="p-2 bg-gray-800 rounded-xl">
      <NodeEdgeColorInput
        :graph="props.graph"
        :colorMap="colorMap"
      />
    </div>

    <div class="p-2 bg-gray-800 rounded-xl">
      <NodeEdgeSizeInput
        :graph="props.graph"
        :sizeMap="sizeMap"
      />
    </div>
  </div>
</template>
