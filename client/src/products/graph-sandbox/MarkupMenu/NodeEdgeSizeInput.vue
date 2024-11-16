<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import { ref } from "vue";
  import type { MarkupSize } from "../types";
  import InputSize from "./InputSize.vue";

  const props = defineProps<{
    graph: Graph;
  }>();

  const getSize = () => {
    return "MD" as const
  };

  const activeSize = ref(getSize());

  const setActiveSize = (value: MarkupSize) => {};

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
