<script setup lang="ts">
  import type { GNode } from "@graph/types";
  import GraphNode from "@ui/graph/GNode.vue";
  import CIcon from "@ui/core/Icon.vue";
  import CPopoverTooltip from "@ui/core/PopoverTooltip.vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";

  defineProps<{
    toNode: GNode;
    fromNode: GNode;
    weight: number;
  }>();
</script>

<template>
  <div
    class="text-xl font-bold text-center flex items-center justify-center overflow-hidden p-[3px]"
  >
    <CPopoverTooltip>
      <GButton
        secondary
        class="h-10 w-10 cursor-default grid place-items-center rounded-md"
      >
        {{ weight }}
      </GButton>
      <template #content>
        <GWell class="flex items-center py-2 px-3 rounded-md">
          <GraphNode :size="30">
            {{ toNode.label }}
          </GraphNode>
          <CIcon
            class="text-2xl"
            icon="arrow_right"
          />
          <GraphNode :size="30">
            {{ fromNode.label }}
          </GraphNode>
        </GWell>
      </template>
    </CPopoverTooltip>
  </div>
</template>
