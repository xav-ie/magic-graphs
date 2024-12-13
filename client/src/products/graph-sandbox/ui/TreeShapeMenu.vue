<script setup lang="ts">
  import { graph } from "@graph/global";
  import { useMoveNodesIntoTreeFormation } from "./useTreeShaper";
  import GNode from "@ui/graph/GNode.vue";
  import CPopover from "@ui/core/Popover.vue";
  import GWell from "@ui/graph/GWell.vue";

  const { shapeGraph } = useMoveNodesIntoTreeFormation(graph.value);
</script>

<template>
  <CPopover>
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>

    <GWell class="p-3 flex flex-wrap justify-center gap-2 max-h-60 max-w-72 overflow-auto rounded-lg">
      <GNode
        v-for="node in graph.nodes.value"
        @click.stop="shapeGraph(node)"
        :key="node.id"
        :node="node"
      />
    </GWell>
  </CPopover>
</template>
