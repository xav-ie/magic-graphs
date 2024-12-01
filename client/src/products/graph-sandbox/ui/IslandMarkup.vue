<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import type { ColorMap } from "../theme/useMarkupColorizer";
  import type { SizeMap } from "../theme/useMarkupSizer";
  import NodeEdgeColorInput from "./MarkupMenu/NodeEdgeColorInput.vue";
  import NodeEdgeSizeInput from "./MarkupMenu/NodeEdgeSizeInput.vue";

  const props = defineProps<{
    graph: Graph;
    sizeMap: SizeMap;
    colorMap: ColorMap;
  }>();
</script>

<template>
  <div class="flex flex-col gap-3">
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
