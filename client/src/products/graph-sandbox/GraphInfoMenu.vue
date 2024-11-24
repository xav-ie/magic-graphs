<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import ToolbarButton from "./ToolbarButton.vue";
  import AdjacencyListDisplay from "./AdjacencyListDisplay.vue";
  import { useAdjacencyList } from "@graph/useAdjacencyList";

  const props = defineProps<{
    graph: Graph;
  }>();

  const { adjacencyList } = useAdjacencyList(props.graph);
</script>

<template>
  <v-menu>
    <template #activator="{ props }">
      <ToolbarButton v-bind="props">mdi-information-outline</ToolbarButton>
    </template>

    <div>
      <AdjacencyListDisplay :adjacencyList="adjacencyList" />
    </div>
  </v-menu>
</template>
