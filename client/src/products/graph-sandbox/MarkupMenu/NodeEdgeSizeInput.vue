<script setup lang="ts">
  import { ref } from "vue";
  import type { Graph } from "@graph/types";
  import type { MarkupSize } from "../types";
  import InputSize from "./InputSize.vue";
  import type { SizeMap } from "../useMarkupSizer";

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
    if (itemSizes.size > 1) return;
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

  props.graph.subscribe("onFocusChange", () => {
    activeSize.value = getSize();
  });
</script>

<template>
  <InputSize
    :model-value="activeSize"
    @update:model-value="setActiveSize"
  />
</template>
