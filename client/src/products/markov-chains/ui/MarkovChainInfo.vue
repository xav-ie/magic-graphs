<script setup lang="ts">
  import { graph } from "@graph/global";
  import GWell from "@ui/graph/GWell.vue";
  import { useMarkovState } from "../misc/useMarkovState";
  import GraphNode from "@ui/graph/GNode.vue";
  import { computed } from "vue";
  import MarkovClassNodes from "./MarkovClassNodes.vue";

  const markovState = useMarkovState(graph.value);

  const recurrentClasses = computed(() => {
    return markovState.classes.value.recurrent.map((nodeIds) => {
      return Array.from(nodeIds).map((nodeId) => {
        return graph.value.getNode(nodeId)!;
      });
    });
  });

  const transientClasses = computed(() => {
    return markovState.classes.value.transient.map((nodeId) => {
      return Array.from(nodeId).map((nodeId) => {
        return graph.value.getNode(nodeId)!;
      });
    });
  });
</script>

<template>
  <GWell
    tertiary
    class="p-3 rounded-lg"
  >
    <div class="flex flex-col">
      <div class="flex gap-4 items-center">
        <MarkovClassNodes :classes="recurrentClasses">
          Recurrent Classes
        </MarkovClassNodes>

        <MarkovClassNodes :classes="transientClasses">
          Transient Classes
        </MarkovClassNodes>
      </div>
    </div>
  </GWell>
</template>
