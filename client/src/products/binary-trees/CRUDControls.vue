<script setup lang="ts">
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import { BinaryTree } from "./tree/avl";
  import { getRandomInRange } from "@utils/random";
  import { nonNullGraph as graph } from "@graph/global";

  const tree = new BinaryTree();

  const rootPos = { x: 2300, y: 1500 }

  const addNode = () => {
    const key = getRandomInRange(1, 100);
    tree.insert(key);
    graph.value.addNode({
      id: key.toString(),
      label: key.toString(),
      ...rootPos
    }, { animate: true });
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
