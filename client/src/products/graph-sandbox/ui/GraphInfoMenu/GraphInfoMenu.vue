<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import CPopover from "@ui/core/Popover.vue";
  import GWell from "@ui/graph/GWell.vue";
  import AdjacencyListDisplay from "./AdjacencyListDisplay.vue";
  import TransitionMatrixDisplay from "./TransitionMatrixDisplay.vue";

  const graphHasNodes = computed(() => graph.value.nodes.value.length > 0);
</script>

<template>
  <CPopover>
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>

    <GWell class="flex flex-col text-xl font-bold p-3 w-[400px] rounded-lg gap-2">
      <h1 class="text-2xl mb-3">Graph Info</h1>

      <div v-if="graphHasNodes">
        <h2 class="mb-2">Adjacency List</h2>

        <GWell
          secondary
          class="p-4 rounded-lg max-h-[200px] overflow-auto"
        >
          <AdjacencyListDisplay />
        </GWell>

        <h2 class="my-2">Transition Matrix</h2>

        <GWell
          secondary
          class="p-4 rounded-lg max-h-[300px] overflow-auto"
        >
          <TransitionMatrixDisplay />
        </GWell>
      </div>

      <div v-else>
        <h2>Try adding some nodes first!</h2>
      </div>
    </GWell>
  </CPopover>
</template>
