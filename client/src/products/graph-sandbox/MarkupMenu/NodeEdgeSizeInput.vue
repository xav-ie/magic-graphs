<script setup lang="ts">
  import { ref } from "vue";
  import type { Graph } from "@graph/types";
  import type { MarkupSize } from "../types";
  import InputSize from "./InputSize.vue";
  import type { SizeMap } from "../useMarkupSizer";
  import { DEFAULT_MARKUP_SIZE, MARKUP_USETHEME_ID, SIZE_TO_WIDTH } from "../types";
  import { useTheme } from "@graph/themes/useTheme";

  const props = defineProps<{
    graph: Graph;
    sizeMap: SizeMap;
  }>();

  const getSize = () => {
    const highlightedIds = Array.from(props.graph.focusedItemIds.value);
    const itemSizes = new Set(
      highlightedIds.map((id) => props.sizeMap.get(id))
    );
    if (itemSizes.has(undefined)) return;
    if (itemSizes.size !== 1) return;
    const size = itemSizes.values().next().value;
    if (!size) return DEFAULT_MARKUP_SIZE;
    return size;
  };

  const activeSize = ref(getSize());

  const setActiveSize = (value: MarkupSize) => {
    for (const id of props.graph.focusedItemIds.value) {
      props.sizeMap.set(id, value);
    }
    activeSize.value = value;
    props.graph.updateEncapsulatedNodeBox();
  };

  const sizeAddedItem = ({ id }: { id: string }) => {
    if (!activeSize.value) return;
    props.sizeMap.set(id, activeSize.value);
  };

  const recalculateActiveSize = async () => {
    if (props.graph.focusedItemIds.value.size === 0) return;
    /**
     * wait for the next tick to ensure that onNodeAdded and onEdgeAdded
     * have a chance to set the size of the just added node or edge
     */
    await new Promise((resolve) => setTimeout(resolve, 0));
    activeSize.value = getSize();
  };

  props.graph.subscribe('onNodeAdded', sizeAddedItem);
  props.graph.subscribe('onEdgeAdded', sizeAddedItem);
  props.graph.subscribe("onFocusChange", recalculateActiveSize);

  const { setTheme } = useTheme(props.graph, MARKUP_USETHEME_ID);
  const sizeLinkPreview = () => SIZE_TO_WIDTH[activeSize.value ?? DEFAULT_MARKUP_SIZE];
  setTheme('linkPreviewWidth', sizeLinkPreview);
</script>

<template>
  <InputSize
    @update:model-value="setActiveSize"
    :model-value="activeSize"
  />
</template>
