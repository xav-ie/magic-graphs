<script setup lang="ts">
  import { ref } from "vue";
  import type { Graph } from "@graph/types";
  import type { ColorMap } from "../useMarkupColorizer";
  import InputColor from "./InputColor.vue";
  import type { Color } from "@utils/colors";
  import { DEFAULT_MARKUP_COLOR } from "../types";

  const props = defineProps<{
    graph: Graph;
    colorMap: ColorMap;
  }>();

  const getColor = () => {
    const highlightedIds = Array.from(props.graph.focusedItemIds.value);
    const itemColors = new Set(
      highlightedIds.map((id) => props.colorMap.get(id))
    );
    if (itemColors.has(undefined)) return DEFAULT_MARKUP_COLOR;
    if (itemColors.size !== 1) return DEFAULT_MARKUP_COLOR;
    return itemColors.values().next().value
  };

  const activeColor = ref(getColor());

  const setActiveColor = (value: Color) => {
    for (const id of props.graph.focusedItemIds.value) {
      props.colorMap.set(id, value);
    }
    activeColor.value = value;
  };

  props.graph.subscribe('onNodeAdded', (node) => {
    if (!activeColor.value) return;
    props.colorMap.set(node.id, activeColor.value);
  });

  props.graph.subscribe('onEdgeAdded', (edge) => {
    if (!activeColor.value) return;
    props.colorMap.set(edge.id, activeColor.value);
  });

  props.graph.subscribe("onFocusChange", async (newFocusedItems) => {
    if (newFocusedItems.size === 0) return;
    /**
     * wait for the next tick to ensure that onNodeAdded and onEdgeAdded
     * have a chance to set the color of the just added node or edge
     */
    await new Promise((resolve) => setTimeout(resolve, 0));
    activeColor.value = getColor();
  });
</script>

<template>
  <InputColor
    @update:model-value="setActiveColor"
    :model-value="activeColor"
  />
</template>
