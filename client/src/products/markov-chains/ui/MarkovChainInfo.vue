<script setup lang="ts">
  import { computed } from "vue";
  import type { GNode } from "@graph/types";
  import { graph } from "@graph/global";
  import GWell from "@ui/graph/GWell.vue";
  import { useMarkovCharacteristics } from "../misc/useMarkovCharacteristics";
  import MarkovClassNodes from "./MarkovClassNodes.vue";

  const markov = useMarkovCharacteristics(graph.value);

  /**
   * goes through classes and replaces node ids with full nodes
   */
  const populateClasses = (classes: Set<GNode["id"]>[]) =>
    classes.map((nodeId) => {
      return Array.from(nodeId).map((nodeId) => {
        return graph.value.getNode(nodeId)!;
      });
    });

  const recurrentClasses = computed(() => {
    return populateClasses(markov.recurrentClasses.value);
  });

  const transientClasses = computed(() => {
    return populateClasses(markov.transientClasses.value);
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
