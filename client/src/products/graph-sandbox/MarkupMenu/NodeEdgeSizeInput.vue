<script setup lang="ts">
  import { ref } from "vue";
  import type { Graph } from "@graph/types";
  import type { MarkupSize } from "../types";
  import InputSize from "./InputSize.vue";
  import type { SizeMap } from "../useMarkupSizer";
  import { DEFAULT_MARKUP_SIZE } from "../types";

  const props = defineProps<{
    graph: Graph;
    sizeMap: SizeMap;
  }>();

  const getSize = () => {
    const highlightedIds = Array.from(props.graph.focusedItemIds.value);
    const itemSizes = new Set(
      highlightedIds.map((id) => props.sizeMap.get(id))
    );
    if (itemSizes.has(undefined)) return DEFAULT_MARKUP_SIZE;
    if (itemSizes.size !== 1) return DEFAULT_MARKUP_SIZE;
    return itemSizes.values().next().value;
  };

  const activeSize = ref(getSize());

  const setActiveSize = (value: MarkupSize) => {
    for (const id of props.graph.focusedItemIds.value) {
      props.sizeMap.set(id, value);
    }
    activeSize.value = value;
    props.graph.updateEncapsulatedNodeBox();
  };

  props.graph.subscribe('onNodeAdded', (node) => {
    if (!activeSize.value) return;
    props.sizeMap.set(node.id, activeSize.value);
  });

  props.graph.subscribe('onEdgeAdded', (edge) => {
    if (!activeSize.value) return;
    props.sizeMap.set(edge.id, activeSize.value);
  });

  props.graph.subscribe("onFocusChange", async (newFocusedItems) => {
    if (newFocusedItems.size === 0) return;
    /**
     * wait for the next tick to ensure that onNodeAdded and onEdgeAdded
     * have a chance to set the size of the just added node or edge
     */
    await new Promise((resolve) => setTimeout(resolve, 0));
    activeSize.value = getSize();
  });
</script>

<template>
  <InputSize
    :model-value="activeSize"
    @update:model-value="setActiveSize"
  />
</template>
