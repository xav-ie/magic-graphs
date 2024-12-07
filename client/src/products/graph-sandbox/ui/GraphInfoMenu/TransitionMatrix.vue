<script setup lang="ts">
  import { computed, ref } from "vue";
  import { graph } from "@graph/global";
  import { useTransitionMatrix } from "@graph/useTransitionMatrix";
  import TransitionMatrixDisplay from "./TransitionMatrixDisplay.vue";
  import GWell from "@ui/graph/GWell.vue";

  const { transitionMatrix } = useTransitionMatrix(
    graph.value
  );
</script>

<template>
  <div class="flex items-end justify-between">
    <h2 class="text-xl font-bold mb-2 mt-5">Transition Matrix</h2>
  </div>
  <GWell
    secondary
    class="p-4 rounded-lg max-h-[300px] overflow-auto"
  >
    <TransitionMatrixDisplay :transition-matrix="transitionMatrix" />
  </GWell>
</template>
