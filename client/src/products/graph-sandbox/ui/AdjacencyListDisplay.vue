<script setup lang="ts">
  import { computed } from "vue";
  import { useAdjacencyList } from "@graph/useAdjacencyList";
  import GraphNode from "@ui/graph/GraphNode.vue";
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
        <GraphNode class="bg-gray-600">
          {{ getLabel(key) }}
        </GraphNode>
      </div>

      <span class="text-xl mx-3">
        <CIcon icon="arrow_right" />
      </span>

      <div class="overflow-auto">
        <div class="flex flex-row gap-4">
          <div v-for="node in value">
            <GraphNode class="bg-gray-600 relative flex flex-col">
              <span class="leading-[15px]">
                {{ node.label }}
              </span>
              <span
                v-if="isWeighted"
                class="leading-[15px] text-[8px]"
              >
                Cost {{ node.weight }}
              </span>
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
