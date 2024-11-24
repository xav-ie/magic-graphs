<script setup lang="ts">
  import type { AdjacencyList } from "@graph/useAdjacencyList";
  import GraphNode from "@ui/graph/GraphNode.vue";

  defineProps<{
    adjacencyList: AdjacencyList;
  }>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="(value, key) in adjacencyList"
      :key="key"
      class="flex items-center"
    >
      <div class="w-[60px]">
        <GraphNode>
          {{ key }}
        </GraphNode>
      </div>

      <span class="text-xl mx-3">
        <v-icon>mdi-arrow-right</v-icon>
      </span>

      <div class="overflow-auto">
        <div class="flex flex-row gap-4">
          <div v-for="node in value">
            <GraphNode class="bg-gray-600">
              {{ node }}
            </GraphNode>
          </div>
          <h2
            v-if="value.length === 0"
            class="text-opacity-50 text-white text-xl font-bold"
          >
            None
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
