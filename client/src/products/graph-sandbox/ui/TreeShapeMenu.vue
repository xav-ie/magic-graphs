<script setup lang="ts">
  import { graph } from "@graph/global";
  import type { AutoTreeControls } from "./useTreeShaper";
  import GraphNode from "@ui/graph/GNode.vue";
  import CPopover from "@ui/core/Popover.vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import { toRef } from "vue";
  import type { GNode } from "@graph/types";

  const props = defineProps<{
    controls: AutoTreeControls;
  }>();

  const treeControls = toRef(props, "controls");

  const { isActive, activate, deactivate, updateShape, rootNode } =
    treeControls.value;

  const nodeSelected = (node: GNode) => {
    rootNode.value = node;
    if (!isActive.value) updateShape();
  };
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
        <GraphNode
          v-for="node in graph.nodes.value"
          @click="nodeSelected(node)"
          :key="node.id"
          :node="node"
          :size="55"
        />
      </GWell>
      <div class="text-sm">
        <GButton
          v-if="isActive"
          @click="deactivate"
          contrast
        >
          Disable Auto Format
        </GButton>
        <GButton
          v-else
          @click="activate"
          tertiary
        >
          Enable Auto Format
        </GButton>
      </div>
    </GWell>
  </CPopover>
</template>
