<script setup lang="ts">
  import { computed } from "vue";
  import type { GNode } from "@graph/types";
  import { graph } from "@graph/global";
  import GWell from "@ui/graph/GWell.vue";
  import type { MarkovChain } from "../markov/useMarkovChain";
  import MarkovClassNodes from "./MarkovClassNodes.vue";
  import ConnectedInfoBox from "@product/graph-sandbox/ui/GraphInfoMenu/ConnectedInfoBox.vue";
  import { usePeriodicityLabels } from "./usePeriodicityLabels";
  import { useSCCColorizer } from "@product/graph-sandbox/ui/GraphInfoMenu/useSCCColorizer";
  import { useIllegalStateColorizer } from "./useIllegalStateColorizer";

  const props = defineProps<{
    markov: MarkovChain;
  }>();

  const { label: labelPeriods, unlabel: unlabelPeriods } = usePeriodicityLabels(
    graph.value,
    props.markov
  );

  const { colorize: colorizeIllegalState, decolorize: decolorizeIllegalState } =
    useIllegalStateColorizer(graph.value, props.markov);

  const { colorize: colorizeCommClass, decolorize: decolorizeCommClass } =
    useSCCColorizer(graph.value, 'markov-communicating-class');

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
    return populateClasses(props.markov.recurrentClasses.value);
  });

  const transientClasses = computed(() => {
    return populateClasses(props.markov.transientClasses.value);
  });

  const definitions = {
    valid: "A markov chain is valid if all states have an outgoing probability of 1.",
    periodic:
      "A markov chain is said to be periodic if the greatest common divisor of the lengths of all possible cycles is greater than one.",
    absorbing:
      "an absorbing markov chain is a chain with at least one absorbing state, which is a state that once entered cannot be left.",
    communicatingClasses:
      "A communicating class is a subset of states in a Markov chain such that any state in the subset can be reached from any other state in the subset.",
    steadyState:
      "A steady state is a state in which the system is in equilibrium and the properties of the system do not change over time.",
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

      <div class="self-start flex flex-wrap max-w-80 max-h-20 gap-2 overflow-auto">
        <ConnectedInfoBox
          @mouseenter="colorizeIllegalState"
          @mouseleave="decolorizeIllegalState"
          :tooltip="definitions.valid"
        >
          Valid? {{ markov.illegalNodeIds.value.size === 0 ? "Yes" : "No" }}
        </ConnectedInfoBox>

        <ConnectedInfoBox
          @mouseenter="labelPeriods"
          @mouseleave="unlabelPeriods"
          :tooltip="definitions.periodic"
        >
          Periodic? {{ markov.isPeriodic.value ? "Yes" : "No" }}
        </ConnectedInfoBox>

        <ConnectedInfoBox :tooltip="definitions.absorbing">
          Absorbing? {{ markov.isAbsorbing.value ? "Yes" : "No" }}
        </ConnectedInfoBox>

        <ConnectedInfoBox
          @mouseenter="colorizeCommClass"
          @mouseleave="decolorizeCommClass"
          :tooltip="definitions.communicatingClasses"
        >
          Communicating Classes:
          {{ markov.communicatingClasses.value.length }}
        </ConnectedInfoBox>

        <ConnectedInfoBox :tooltip="definitions.steadyState + markov.steadyState.value">
          Unique Steady State? {{ markov.steadyState.value ? "Yes" : "No" }}
        </ConnectedInfoBox>
      </div>
    </div>
  </GWell>
</template>
