<script setup lang="ts">
import { computed, ref } from "vue";
import { graph } from "@graph/global";
import { useTransitionMatrix } from "@graph/useTransitionMatrix";
import colors from "@utils/colors";
import CButton from "@ui/core/button/Button.vue";
import CIcon from "@ui/core/Icon.vue";
import TransitionMatrixDisplay from "./TransitionMatrixDisplay.vue";
import GWell from "@ui/graph/GWell.vue";

const { transitionMatrix, unweightedTransitionMatrix } = useTransitionMatrix(graph.value);

const displayWeightedTransitionMatrix = ref(true);

const toggle = () => (displayWeightedTransitionMatrix.value = !displayWeightedTransitionMatrix.value);

const currentTransitionMatrix = computed(() =>
  displayWeightedTransitionMatrix.value
    ? transitionMatrix.value
    : unweightedTransitionMatrix.value
);
</script>

<template>
  <div class="flex items-end justify-between">
    <h2 class="text-xl font-bold mb-2 mt-5">Transition Matrix</h2>
    <CButton
      @click="toggle"
      :color="colors.GRAY_800"
      :text-color="colors.GRAY_300"
      class="aspect-square"
    >
      <CIcon icon="sync"></CIcon>
    </CButton>
  </div>
  <GWell
    secondary
    class="p-4 rounded-lg max-h-[300px] overflow-auto"
  >
    <TransitionMatrixDisplay
      :transition-matrix="currentTransitionMatrix"
    />
  </GWell>
</template>
