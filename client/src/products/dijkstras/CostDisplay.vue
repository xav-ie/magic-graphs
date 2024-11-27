<script setup lang="ts">
  import type { GNode, Graph } from "@graph/types";
  import colors from "@colors";
  import { SIM_COLORS, INF_STR } from "./useSimulationTheme";

  const props = defineProps<{
    graph: Graph;
  }>();

  const { getTheme, isFocused } = props.graph;

  const getNodeCosts = (node: GNode) => getTheme("nodeText", node);

  const costToColor = (strCost: string) => {
    if (strCost === INF_STR) return colors.RED_800;
    const cost = Number(strCost);
    if (cost === Infinity || isNaN(cost)) return colors.GRAY_500;
    if (cost === 0) return colors.GREEN_700;
    if (cost < 3) return colors.GREEN_500;
    if (cost < 5) return colors.YELLOW_500;
    if (cost < 7) return colors.ORANGE_500;
    if (cost < 9) return colors.RED_400;
    return colors.RED_600;
  };

  const isExplored = (node: GNode) => getTheme("nodeBorderColor", node) === SIM_COLORS.EXPLORED;
  const isExploring = (node: GNode) => getTheme("nodeBorderColor", node) === SIM_COLORS.EXPLORING;
  const isSource = (node: GNode) => getTheme("nodeBorderColor", node) === SIM_COLORS.SOURCE;

  const exploreStateColor = (node: GNode) => {
    if (isExplored(node)) return SIM_COLORS.EXPLORED;
    if (isExploring(node)) return SIM_COLORS.EXPLORING;
    if (isSource(node)) return SIM_COLORS.SOURCE;
    if (props.graph.isFocused(node.id)) return getTheme("nodeBorderColor", node);
    return colors.GRAY_600;
  };

  const exploreStateText = (node: GNode) => {
    if (isExplored(node)) return "Explored";
    if (isExploring(node)) return "Exploring";
    if (isSource(node)) return "Source";
    if (isFocused(node.id)) return "Highlighted";
    return "Unexplored";
  };
</script>

<template>
  <div
    v-for="node in graph.nodes.value"
    @click="graph.setFocus([node.id])"
    class="text-white flex items-center gap-3 p-2 hover:bg-gray-900 cursor-pointer rounded-lg"
  >
    <span class="text-2xl w-6 text-center font-bold">
      {{ node.label }}
    </span>
    <span class="font-bold">→</span>
    <div
      class="text-lg rounded-lg h-8 w-16 grid place-items-center"
      :style="{ backgroundColor: costToColor(getNodeCosts(node)) }"
    >
      {{ getNodeCosts(node) }}
    </div>
    <div
      class="text-lg rounded-lg h-8 w-32 grid place-items-center font-bold"
      :style="{ backgroundColor: exploreStateColor(node) }"
    >
      {{ exploreStateText(node) }}
    </div>
  </div>
</template>
