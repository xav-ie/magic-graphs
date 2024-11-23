<script setup lang="ts">
  import { ref } from "vue";
  import type { Graph } from "@graph/types";
  import type { ColorMap } from "../useMarkupColorizer";
  import InputColor from "./InputColor.vue";
  import type { Color } from "@utils/colors";

  const props = defineProps<{
    graph: Graph;
    colorMap: ColorMap;
  }>();

  const getColor = () => {
    const highlightedIds = Array.from(props.graph.focusedItemIds.value);
    const itemColors = new Set(
      highlightedIds.map((id) => props.colorMap.get(id))
    );
    if (itemColors.has(undefined)) return
    if (itemColors.size > 1) return
    return itemColors.values().next().value
  };

  const activeColor = ref(getColor());

  const setActiveColor = (value: Color) => {
    for (const id of props.graph.focusedItemIds.value) {
      props.colorMap.set(id, value);
    }
    activeColor.value = value;
  };

  props.graph.subscribe("onFocusChange", () => {
    activeColor.value = getColor();
  });
</script>

<template>
  <InputColor
    :model-value="activeColor"
    @update:model-value="setActiveColor"
  />
</template>
