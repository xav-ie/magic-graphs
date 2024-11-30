<script setup lang="ts">
  import { useAdjacencyList } from "@graph/useAdjacencyList";
  import GraphNode from "@ui/graph/GraphNode.vue";
  import type { Graph } from "@graph/types";
  import { globalGraph } from "@graph/global";

  const props = defineProps<{
    graph: Graph,
  }>();

  const { weightedAdjacencyList } = useAdjacencyList(globalGraph.value);

  const getLabel = (nodeId: string) => {
    return props.graph.getNode(nodeId)?.label;
  };
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
        <v-icon>mdi-arrow-right</v-icon>
      </span>

      <div class="overflow-auto">
        <div class="flex flex-row gap-4">
          <div v-for="node in value">
            <GraphNode class="bg-gray-600 relative flex flex-col">
              <span class="leading-[15px]">
                {{ node.label }}
              </span>
              <span
                v-if="props.graph.settings.value.displayEdgeLabels"
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
