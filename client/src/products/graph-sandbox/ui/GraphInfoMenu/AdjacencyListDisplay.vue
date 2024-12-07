<script setup lang="ts">
  import { computed } from "vue";
  import { useAdjacencyList } from "@graph/useAdjacencyList";
  import GNode from "@ui/graph/GNode.vue";
  import { graph } from "@graph/global";
  import CIcon from "@ui/core/Icon.vue";

  const { weightedAdjacencyList } = useAdjacencyList(graph.value);

  const getLabel = (nodeId: string) => {
    return graph.value.getNode(nodeId)?.label;
  };

  const isWeighted = computed(
    () => graph.value.settings.value.displayEdgeLabels
  );
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="(value, key) in weightedAdjacencyList"
      :key="key"
      class="flex items-center"
    >
      <div>
        <GNode>
          {{ getLabel(key) }}
        </GNode>
      </div>

      <CIcon
        icon="arrow_right"
        class="text-4xl"
      />

      <div class="overflow-auto">
        <div class="flex items-center gap-4">
          <div 
            v-for="node in value" 
            :key="node.id"
          >
            <GNode class="relative flex flex-col">
              <span class="leading-[15px]">
                {{ node.label }}
              </span>
              <span
                v-if="isWeighted"
                class="leading-[15px] text-[8px]"
              >
                Cost {{ node.weight }}
              </span>
            </GNode>
          </div>
          <h2
            v-if="value.length === 0"
            class="opacity-60"
          >
            None
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
