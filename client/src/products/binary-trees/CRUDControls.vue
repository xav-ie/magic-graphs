<script setup lang="ts">
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import { AVLTree } from "./tree/avl";
  import { getRandomInRange } from "@utils/random";

  const addNode = () => {
    const key = getRandomInRange(1, 100);

  };
</script>

<template>
  <GWell
    secondary
    class="rounded-lg p-2"
  >
    <GButton
      @click="addNode"
      tertiary
    >Add Node</GButton>
  </GWell>
</template>
