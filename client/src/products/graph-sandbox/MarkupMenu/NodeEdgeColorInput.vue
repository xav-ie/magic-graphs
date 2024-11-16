<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import type { ColorMap } from "../useMarkupColorizer";
  import InputColor from "./InputColor.vue";
  import colors from "@utils/colors";
  import type { Color } from "@utils/colors";
  import { ref } from "vue";

  const props = defineProps<{
    graph: Graph;
    colorMap: ColorMap;
  }>();

  const getColor = () => {
    const highlightedIds = Array.from(props.graph.focusedItemIds.value);
    const itemColors = new Set(
      highlightedIds.map((id) => props.colorMap.get(id))
    );
    if (itemColors.has(undefined)) return colors.BLACK;
    if (itemColors.size > 1) return colors.BLACK;
    return itemColors.values().next().value as Color;
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
    :modelValue="activeColor"
    @update:modelValue="setActiveColor"
  />
</template>
