<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import GWell from "@ui/graph/GWell.vue";
  import ConnectedInfoBox from "./ConnectedInfoBox.vue";

  const isConnected = computed(
    () => graph.value.characteristics.isConnected.value
  );
  const isWeaklyConnected = computed(
    () => graph.value.characteristics.isWeaklyConnected.value
  );
  const isDirected = computed(() => graph.value.settings.value.isGraphDirected);

  const definitions = {
    isConnected: "A graph is <b>connected</b> if there is a path between every pair of nodes/vertices.",
    isWeaklyConnected: "A directed graph is <b>weakly connected</b> if replacing all of its directed edges with undirected edges produces a connected (undirected) graph.",
    isStronglyConnected: "A directed graph is <b>strongly connected</b> if there is a directed path from every vertex to every other vertex.",
  } as const;
</script>

<template>
  <div class="mb-2 text-lg">
    <div
      v-if="isDirected"
      class="flex flex-wrap gap-2"
    >
      <ConnectedInfoBox
        v-if="isConnected"
        :tooltip="definitions.isStronglyConnected"
      >
        Strongly Connected
      </ConnectedInfoBox>

      <ConnectedInfoBox
        v-else
        :tooltip="definitions.isStronglyConnected"
      >
        Not Strongly Connected
      </ConnectedInfoBox>

      <ConnectedInfoBox
        v-if="isWeaklyConnected"
        :tooltip="definitions.isWeaklyConnected"
      >
        Weakly Connected
      </ConnectedInfoBox>

      <ConnectedInfoBox
        v-else
        :tooltip="definitions.isWeaklyConnected"
      >
        Not Weakly Connected
      </ConnectedInfoBox>
    </div>
    <div
      v-else
      class="flex flex-wrap gap-2"
    >
      <ConnectedInfoBox
        v-if="isConnected"
        :tooltip="definitions.isConnected"
      >
        Connected
      </ConnectedInfoBox>

      <ConnectedInfoBox
        v-else
        :tooltip="definitions.isConnected"
      >
        Not Connected
      </ConnectedInfoBox>
    </div>
  </div>
</template>
