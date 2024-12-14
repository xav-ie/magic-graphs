<script setup lang="ts">
  import { computed } from "vue";
  import type { GNode } from "@graph/types";
  import { graph } from "@graph/global";
  import GWell from "@ui/graph/GWell.vue";
  import { useMarkovCharacteristics } from "../misc/useMarkovCharacteristics";
  import MarkovClassNodes from "./MarkovClassNodes.vue";
  import ConnectedInfoBox from "@product/graph-sandbox/ui/GraphInfoMenu/ConnectedInfoBox.vue";

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

  const definitions = {
    periodic:
      "A markov chain is said to be periodic if the greatest common divisor of the lengths of all possible cycles is greater than one.",
    absorbing:
      "an absorbing markov chain is a chain with at least one absorbing state, which is a state that once entered cannot be left.",
    communicatingClasses:
      "A communicating class is a subset of states in a Markov chain such that any state in the subset can be reached from any other state in the subset.",
  };
</script>

<template>
  <GWell class="p-3 rounded-lg">
    <div class="flex gap-4 items-center">
      <MarkovClassNodes :classes="recurrentClasses">
        Recurrent Classes ({{ recurrentClasses.length }})
      </MarkovClassNodes>

      <MarkovClassNodes :classes="transientClasses">
        Transient Classes ({{ transientClasses.length }})
      </MarkovClassNodes>

      <div class="self-start flex flex-wrap max-w-80 gap-2">
        <ConnectedInfoBox :tooltip="definitions.periodic">
          Periodic? {{ markov.isPeriodic.value ? "Yes" : "No" }}
        </ConnectedInfoBox>

        <ConnectedInfoBox :tooltip="definitions.absorbing">
          Absorbing? {{ markov.isAbsorbing.value ? "Yes" : "No" }}
        </ConnectedInfoBox>

        <ConnectedInfoBox :tooltip="definitions.communicatingClasses">
          Communicating Classes: {{ markov.communicatingClasses.value.length }}
        </ConnectedInfoBox>
      </div>
    </div>
  </GWell>
</template>
