<script setup lang="ts">
  import { computed, toRef } from "vue";
  import { graph } from "@graph/global";
  import type { AutoTreeControls } from "./useTreeShaper";
  import GraphNode from "@ui/graph/GNode.vue";
  import CPopover from "@ui/core/Popover.vue";
  import GWell from "@ui/graph/GWell.vue";
  import CWell from "@ui/core/Well.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import colors from "@utils/colors";
  import type { GNode } from "@graph/types";

  const props = defineProps<{
    controls: AutoTreeControls;
  }>();

  const treeControls = toRef(props, "controls");

  const { isActive, activate, deactivate, updateShape, rootNodeId } =
    treeControls.value;

  const nodeSelected = (node: GNode) => {
    rootNodeId.value = node.id;
    if (!isActive.value) updateShape();
  };

  const rootNode = computed(() => {
    if (!rootNodeId.value) return;
    return graph.value.getNode(rootNodeId.value);
  });
</script>

<template>
  <CPopover>
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>

    <GWell
      class="p-3 flex flex-col gap-2 w-72 rounded-lg"
    >

      <div
        v-if="graph.nodes.value.length > 0"
        class="flex flex-col gap-2"
      >

        <h1 class="font-bold text-xl">Pick A Root Node</h1>
        <CWell
          v-if="isActive && rootNode"
          :color="colors.RED_600"
          class="rounded-md px-2 py-1 font-bold text-xs animate-pulse"
        >
          <h2>Actively Tracking Node {{ rootNode.label }}</h2>
        </CWell>
        <GWell
          secondary
          class="py-3 flex flex-wrap justify-center gap-2 max-h-48 rounded-md overflow-auto"
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

      </div>

      <div
        v-else
        class="flex flex-col gap-2"
      >
        <h1 class="font-bold text-xl">Where Are The Nodes?!</h1>
        <p class="text-base">
          Add some nodes to the graph, then come back to check out how we
          can <span class="text-magic">magically</span> shape them into a tree!
        </p>
      </div>

    </GWell>
  </CPopover>
</template>
