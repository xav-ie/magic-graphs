<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import type { Graph } from "@graph/types";
  import InputColor from "@ui/InputColor.vue";
  import { useMarkupColorizer } from "./useMarkupColorizer";
  import colors, { type Color } from "@utils/colors";

  const props = defineProps<{
    graph: Graph;
  }>();

  const COLOR_PALETTE = [
    colors.BLUE_600,
    colors.RED_600,
    colors.GREEN_600,
    colors.YELLOW_600,
  ];

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

  const getColor = () => {
    const highlightedIds = Array.from(props.graph.highlightedItemIds.value);
    const itemColors = new Set(highlightedIds.map((id) => colorMap.value.get(id)));
    if (itemColors.has(undefined)) return colors.BLACK;
    if (itemColors.size > 1) return colors.BLACK;
    return itemColors.values().next().value as Color;
  };

  const color = ref(getColor());

  const setColor = (value: Color) => {
    for (const id of props.graph.highlightedItemIds.value) {
      colorMap.value.set(id, value);
    }
    color.value = value;
  };

  watch(
    () => props.graph.highlightedItemIds.value,
    () => {
      color.value = getColor();
    }
  );
</script>

<template>
  <div
    v-if="props.graph.highlightedItemIds.value.size > 0"
    class="bg-gray-800 p-3 w-60 flex flex-col gap-3 rounded-r-xl"
  >
    <h1 class="text-white font-bold text-2xl">
      {{ title }}
    </h1>
    <div>
      <div class="flex gap-1">
        <button
          v-for="paletteColor in COLOR_PALETTE"
          @click="setColor(paletteColor)"
          :class="[
            'cursor-pointer',
            'rounded-xl',
            'p-1',
            'border-2',
            color === paletteColor ? 'border-white' : 'border-transparent',
            color === paletteColor
              ? 'hover:border-white'
              : 'hover:border-gray-400',
          ]"
        >
          <div
            :class="['w-8', 'h-8', 'rounded-md', `bg-[${paletteColor}]`]"
          ></div>
        </button>
      </div>
    </div>
  </div>
</template>
