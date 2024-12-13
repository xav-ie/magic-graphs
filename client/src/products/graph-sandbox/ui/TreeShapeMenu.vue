<script setup lang="ts">
  import { ref } from "vue";
  import { graph } from "@graph/global";
  import { useMoveNodesIntoTreeFormation } from "./useTreeShaper";
  import GNode from "@ui/graph/GNode.vue";
  import CPopover from "@ui/core/Popover.vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";

  const { shapeGraph } = useMoveNodesIntoTreeFormation(graph.value);

  const autoFormatActive = ref(false);
</script>

<template>
  <CPopover>
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>

    <GWell
      class="p-2 flex flex-col gap-2 max-h-72 max-w-72 overflow-auto rounded-lg"
    >
      <h1 class="font-bold text-xl">Pick A Root Node</h1>
      <GWell
        secondary
        class="py-3 flex flex-wrap justify-center gap-2 rounded-md overflow-auto"
      >
        <GNode
          v-for="node in graph.nodes.value"
          @click="shapeGraph(node)"
          :key="node.id"
          :node="node"
          :size="55"
        />
      </GWell>
      <div class="text-sm">
        <GButton
          v-if="autoFormatActive"
          @click="autoFormatActive = false"
          contrast
        >
          Disable Auto Format
        </GButton>
        <GButton
          v-else
          @click="autoFormatActive = true"
          tertiary
        >
          Enable Auto Format
        </GButton>
      </div>
    </GWell>
  </CPopover>
</template>
