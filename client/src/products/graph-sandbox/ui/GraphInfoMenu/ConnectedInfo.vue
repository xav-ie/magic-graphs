<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import GHoverInfo from "@ui/graph/GHoverInfo.vue";
  import { useSCCColorizer } from "./useSCCColorizer";
  import { useBipartiteColorizer } from "./useBipartiteColorizer";
  import { useCycleColorizer } from "./useCycleColorizer";

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

  const isBipartite = computed(
    () => graph.value.characteristics.isBipartite.value
  );

  const isAcyclic = computed(() => graph.value.characteristics.isAcyclic.value);

  const isComplete = computed(
    () => graph.value.characteristics.isComplete.value
  );

  const { colorize: colorizeSCCs, decolorize: decolorizeSCCs } =
    useSCCColorizer(graph.value);

  const { colorize: colorizeBipartite, decolorize: decolorizeBipartite } =
    useBipartiteColorizer(graph.value);

  const { colorize: colorizeCycles, decolorize: decolorizeCycles } =
    useCycleColorizer(graph.value);

  const explanations = {
    isConnected:
      "A graph is <b>connected</b> if there is a path between every pair of nodes/vertices.",
    isWeaklyConnected:
      "A directed graph is <b>weakly connected</b> if replacing all of its directed edges with undirected edges produces a connected (undirected) graph.",
    isStronglyConnected:
      "A directed graph is <b>strongly connected</b> if there is a directed path from every vertex to every other vertex.",
    stronglyConnectedComponents:
      "A <b>strongly connected component</b> or SCC in a directed graph is a maximal group of vertices where every vertex is reachable from every other vertex within the group. If you can travel between any two vertices in both directions (following the edges), they belong to the same SCC.",
    bipartite:
      "A graph is <b>bipartite</b> if its vertices can be divided into two disjoint sets U and V such that every edge connects a vertex in U to one in V.",
    acyclic:
      "A graph is <b>acyclic</b> if it has no cycles (loops). For example, A -> B -> C -> A is a cycle.",
    complete: "A graph is <b>complete</b> if every pair of distinct vertices is connected by a unique edge or if the graph is directed, by a pair of unique edges (one in each direction).",
  } as const;
</script>

<template>
  <div class="mb-2 text-sm">
    <div
      v-if="isDirected"
      class="flex flex-wrap gap-2"
    >
      <GHoverInfo :tooltip="explanations.isStronglyConnected">
        Strongly Connected? {{ isConnected ? "Yes" : "No" }}
      </GHoverInfo>

      <GHoverInfo :tooltip="explanations.isWeaklyConnected">
        Weakly Connected? {{ isWeaklyConnected ? "Yes" : "No" }}
      </GHoverInfo>

      <GHoverInfo
        @mouseenter="colorizeSCCs"
        @mouseleave="decolorizeSCCs"
        :tooltip="explanations.stronglyConnectedComponents"
      >
        Strongly Connected Components: {{ SCCs.length }}
      </GHoverInfo>

      <GHoverInfo
        @mouseenter="colorizeBipartite"
        @mouseleave="decolorizeBipartite"
        :tooltip="explanations.bipartite"
      >
        Bipartite? {{ isBipartite ? "Yes" : "No" }}
      </GHoverInfo>

      <GHoverInfo
        @mouseenter="colorizeCycles"
        @mouseleave="decolorizeCycles"
        :tooltip="explanations.acyclic"
      >
        Acyclic? {{ isAcyclic ? "Yes" : "No" }}
      </GHoverInfo>

      <GHoverInfo :tooltip="explanations.complete">
        Complete? {{ isComplete ? "Yes" : "No" }}
      </GHoverInfo>
    </div>
    <div
      v-else
      class="flex flex-wrap gap-2"
    >
      <GHoverInfo :tooltip="explanations.isConnected">
        Connected? {{ isConnected ? "Yes" : "No" }}
      </GHoverInfo>

      <GHoverInfo
        @mouseenter="colorizeBipartite"
        @mouseleave="decolorizeBipartite"
        :tooltip="explanations.bipartite"
      >
        Bipartite? {{ isBipartite ? "Yes" : "No" }}
      </GHoverInfo>

      <GHoverInfo
        @mouseenter="colorizeCycles"
        @mouseleave="decolorizeCycles"
        :tooltip="explanations.acyclic"
      >
        Acyclic? {{ isAcyclic ? "Yes" : "No" }}
      </GHoverInfo>

      <GHoverInfo :tooltip="explanations.complete">
        Complete? {{ isComplete ? "Yes" : "No" }}
      </GHoverInfo>
    </div>
  </div>
</template>
