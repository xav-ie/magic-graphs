<script setup lang="ts">
  import { graph } from "@graph/global";
  import { usePeriodicityLabels } from "./usePeriodicityLabels";
  import { useSCCColorizer } from "@product/graph-sandbox/ui/GraphInfoMenu/useSCCColorizer";
  import { useIllegalStateColorizer } from "./useIllegalStateColorizer";
  import { useLabelSteadyState } from "./useLabelSteadyState";
  import type { MarkovChain } from "../markov/useMarkovChain";
  import GHoverInfoTop from "@ui/graph/GHoverInfoTop.vue";
  import GWell from "@ui/graph/GWell.vue";

  const props = defineProps<{
    markov: MarkovChain;
  }>();

  const { label: labelPeriods, unlabel: unlabelPeriods } = usePeriodicityLabels(
    graph.value,
    props.markov
  );

  const { label: labelSteadyState, unlabel: unlabelSteadyState } =
    useLabelSteadyState(graph.value, props.markov);

  const { colorize: colorizeIllegalState, decolorize: decolorizeIllegalState } =
    useIllegalStateColorizer(graph.value, props.markov);

  const { colorize: colorizeCommClass, decolorize: decolorizeCommClass } =
    useSCCColorizer(graph.value, "markov-communicating-class");

  const definitions = {
    valid:
      "A markov chain is valid if all states have an outgoing probability of 1.",
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
  <GWell
    secondary
    class="p-2 rounded-lg flex flex-wrap gap-2"
  >
    <GHoverInfoTop
      @mouseenter="colorizeIllegalState"
      @mouseleave="decolorizeIllegalState"
      :tooltip="definitions.valid"
    >
      Valid? {{ markov.illegalNodeIds.value.size === 0 ? "Yes" : "No" }}
    </GHoverInfoTop>

    <GHoverInfoTop
      @mouseenter="labelPeriods"
      @mouseleave="unlabelPeriods"
      :tooltip="definitions.periodic"
    >
      Periodic? {{ markov.isPeriodic.value ? "Yes" : "No" }}
    </GHoverInfoTop>

    <GHoverInfoTop :tooltip="definitions.absorbing">
      Absorbing? {{ markov.isAbsorbing.value ? "Yes" : "No" }}
    </GHoverInfoTop>

    <GHoverInfoTop
      @mouseenter="colorizeCommClass"
      @mouseleave="decolorizeCommClass"
      :tooltip="definitions.communicatingClasses"
    >
      Communicating Classes:
      {{ markov.communicatingClasses.value.length }}
    </GHoverInfoTop>

    <GHoverInfoTop
      @mouseenter="labelSteadyState"
      @mouseleave="unlabelSteadyState"
      :tooltip="definitions.steadyState"
    >
      Unique Steady State? {{ markov.steadyState.value ? "Yes" : "No" }}
    </GHoverInfoTop>
  </GWell>
</template>
