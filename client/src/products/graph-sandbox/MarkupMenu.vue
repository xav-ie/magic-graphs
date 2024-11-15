<script setup lang="ts">
  import { computed, ref } from "vue";
  import type { Graph } from "@graph/types";
  import InputColor from "@ui/InputColor.vue";
  import Button from "@ui/Button.vue";
  import { useMarkupColorizer } from "./useMarkupColorizer";

  const props = defineProps<{
    graph: Graph;
  }>();

  const { colorize, colorMap } = useMarkupColorizer(props.graph);
  colorize();

  const title = computed(() => {
    const ids = Array.from(props.graph.highlightedItemIds.value);
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

  const color = ref("#000000");

  const applyColor = () => {
    for (const id of props.graph.highlightedItemIds.value) {
      colorMap.set(id, color.value);
    }
  };
</script>

<template>
  <div
    v-if="props.graph.highlightedItemIds.value.size > 0"
    class="bg-gray-800 p-3 w-60 flex flex-col gap-3"
  >
    <h1 class="text-white font-bold text-2xl">
      {{ title }}
    </h1>
    <InputColor
      v-model="color"
      class="w-10 h-10"
    />
    <Button
      @click="applyColor"
    >
      Apply Color
    </Button>
  </div>
</template>
