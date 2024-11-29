<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import AdjacencyListDisplay from "./AdjacencyListDisplay.vue";

  const props = defineProps<{
    graph: Graph;
  }>();
</script>

<template>
  <v-menu :offset="[10, 0]">
    <template #activator="{ props, isActive }">
      <div v-bind="props">
        <slot :isActive="isActive"></slot>
      </div>
    </template>

    <div class="bg-gray-800 flex flex-col text-white p-3 w-[400px] rounded-lg">
      <h1 class="text-2xl font-bold text-gray-200 mb-3">Graph Info</h1>

      <h2 class="text-xl font-bold text-gray-200 mb-2">Adjacency List</h2>
      <div class="bg-gray-700 p-4 rounded-lg max-h-[200px] overflow-auto">
        <AdjacencyListDisplay :graph="graph" />
      </div>
    </div>
  </v-menu>
</template>
