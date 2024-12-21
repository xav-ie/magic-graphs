<script setup lang="ts">
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";

  const addNode = () => {
    console.log("addNode");
  };
</script>

<template>
  <GWell
    secondary
    class="rounded-lg p-2"
  >
    <GButton
      tertiary
      @click="addNode"
    >Add Node</GButton>
  </GWell>
</template>
