<script setup lang="ts">
  import { ref } from "vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import { getRandomInRange } from "@utils/random";
  import { nonNullGraph as graph } from "@graph/global";

  const key = ref(getRandomInRange(1, 999));

  const addNode = () => {

  };
</script>

<template>
  <div class="flex flex-col gap-3">
    <GWell
      secondary
      class="rounded-lg flex gap-2 p-2"
    >
      <GButton
        @click="addNode"
        tertiary
      >
        Add Node ({{ key }})
      </GButton>
      <GButton
        @click="graph.reset"
        tertiary
      >
        Reset Graph
      </GButton>
    </GWell>
  </div>
</template>
