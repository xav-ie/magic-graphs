<script setup lang="ts">
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import { AVLTree, BinaryTree } from "./tree/avl";
  import { getRandomInRange } from "@utils/random";
  import { nonNullGraph as graph } from "@graph/global";
  import { useSimulationControls } from "@ui/product/sim/useSimulationControls";

  const tree = new AVLTree();

  const rootPos = { x: 2300, y: 1500 }

  const addNode = () => {
    const key = getRandomInRange(1, 100);
    const trace = tree.insert(key);

    const sim = useSimulationControls(trace)

    tree.toGraph(graph.value, rootPos);
  };
</script>

<template>
  <GWell
    secondary
    class="rounded-lg flex gap-2 p-2"
  >
    <GButton
      @click="addNode"
      tertiary
    >Add Node</GButton>
    <GButton
      @click="graph.reset"
      tertiary
    >Reset Graph</GButton>
  </GWell>
</template>
