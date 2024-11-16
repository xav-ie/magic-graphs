<script setup lang="ts">
  import { computed } from "vue";
  import type { Graph } from "@graph/types";
  import { useMarkupColorizer } from "./useMarkupColorizer";
  import NodeEdgeColorInput from "./MarkupMenu/NodeEdgeColorInput.vue";
import NodeEdgeSizeInput from "./MarkupMenu/NodeEdgeSizeInput.vue";

  const props = defineProps<{
    graph: Graph;
  }>();

  const { colorize, colorMap } = useMarkupColorizer(props.graph);
  colorize();

  const title = computed(() => {
    const ids = Array.from(props.graph.focusedItemIds.value);
    if (ids.length === 1) {
      const [id] = ids;
      const node = props.graph.getNode(id);
      if (node) return `Node ${node.label}`;
      const edge = props.graph.getEdge(id);
      if (!edge) return "?";
      const toNode = props.graph.getNode(edge.to);
      const fromNode = props.graph.getNode(edge.from);
      const connector = edge.type === "directed" ? "→" : "↔";
      return `Edge ${fromNode?.label ?? "?"} ${connector} ${
        toNode?.label ?? "?"
      }`;
    }
    return `${ids.length} Nodes & Edges`;
  });
</script>

<template>
  <div
    v-if="props.graph.focusedItemIds.value.size > 0"
    class="bg-gray-800 p-3 flex flex-col gap-3 rounded-r-xl"
  >
    <h1 class="text-white font-bold text-2xl pl-1">
      {{ title }}
    </h1>

    <div class="flex flex-col gap-3">
      <NodeEdgeColorInput
        :graph="props.graph"
        :colorMap="colorMap"
      />

      <NodeEdgeSizeInput
        :graph="props.graph"
      />
    </div>

  </div>
</template>
