<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import ConnectedInfoBox from "./ConnectedInfoBox.vue";
  import { useSCCColorizer } from "./useSCCColorizer";

  const isConnected = computed(
    () => graph.value.characteristics.isConnected.value
  );
  const isWeaklyConnected = computed(
    () => graph.value.characteristics.isWeaklyConnected.value
  );
  const isDirected = computed(() => graph.value.settings.value.isGraphDirected);

  const SCCs = computed(() => {
    const components =
      graph.value.characteristics.stronglyConnectedComponents.value;
    return components.map((nodes) => nodes.map((node) => node.label));
  });

  const { colorize: colorizeSCCs, decolorize: decolorizeSCCs } = useSCCColorizer(graph.value);

  const explanations = {
    isConnected:
      "A graph is <b>connected</b> if there is a path between every pair of nodes/vertices.",
    isWeaklyConnected:
      "A directed graph is <b>weakly connected</b> if replacing all of its directed edges with undirected edges produces a connected (undirected) graph.",
    isStronglyConnected:
      "A directed graph is <b>strongly connected</b> if there is a directed path from every vertex to every other vertex.",
    stronglyConnectedComponents:
      "A <b>strongly connected component</b> or SCC in a directed graph is a maximal group of vertices where every vertex is reachable from every other vertex within the group. If you can travel between any two vertices in both directions (following the edges), they belong to the same SCC.",
  } as const;
</script>

<template>
  <div class="mb-2 text-sm">
    <div
      v-if="isDirected"
      class="flex flex-wrap gap-2"
    >
      <ConnectedInfoBox :tooltip="explanations.isStronglyConnected">
        Strongly Connected? {{ isConnected ? "Yes" : "No" }}
      </ConnectedInfoBox>

      <ConnectedInfoBox :tooltip="explanations.isWeaklyConnected">
        Weakly Connected? {{ isWeaklyConnected ? "Yes" : "No" }}
      </ConnectedInfoBox>

      <ConnectedInfoBox
        @mouseenter="colorizeSCCs"
        @mouseleave="decolorizeSCCs"
        :tooltip="explanations.stronglyConnectedComponents"
      >
        Strongly Connected Components: {{ SCCs.length }}
      </ConnectedInfoBox>
    </div>
    <div
      v-else
      class="flex flex-wrap gap-2"
    >
      <ConnectedInfoBox :tooltip="explanations.isConnected">
        Connected? {{ isConnected ? "Yes" : "No" }}
      </ConnectedInfoBox>
    </div>
  </div>
</template>
