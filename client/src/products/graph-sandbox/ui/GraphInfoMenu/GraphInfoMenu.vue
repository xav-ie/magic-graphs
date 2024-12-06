<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import CPopover from "@ui/core/Popover.vue";
  import AdjacencyList from "./AdjacencyList.vue";
  import TransitionMatrix from "./TransitionMatrix.vue";

  const graphHasNodes = computed(() => graph.value.nodes.value.length > 0);
</script>

<template>
  <CPopover>
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>
    <div
      class="bg-gray-800 flex flex-col text-white p-3 w-[400px] rounded-lg gap-2"
    >
      <h1 class="text-2xl font-bold text-gray-200 mb-3">Graph Info</h1>
      <div v-if="graphHasNodes">
        <AdjacencyList />
        <TransitionMatrix />
      </div>
      <div v-else>
        <h2>Add some nodes to get started</h2>
      </div>
    </div>
  </CPopover>
</template>
