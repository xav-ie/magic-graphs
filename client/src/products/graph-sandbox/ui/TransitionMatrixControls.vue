<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useTransitionMatrix } from "@graph/useTransitionMatrix";
  import TransitionMatrixDisplay from "./TransitionMatrixDisplay.vue";
  import { graph } from "@graph/global";
  import CButton from "@ui/core/Button.vue";
  import CIcon from "@ui/core/Icon.vue";
  import colors from "@utils/colors";

  const { transitionMatrix, unweightedTransitionMatrix } = useTransitionMatrix(
    graph.value
  );

  const displayWeightedTransitionMatrix = ref(true);

  const toggle = () => (displayWeightedTransitionMatrix.value = !displayWeightedTransitionMatrix.value);

  const currentTransitionMatrix = computed(() =>
    displayWeightedTransitionMatrix.value
      ? transitionMatrix.value
      : unweightedTransitionMatrix.value
  );
</script>

<template>
  <CButton
    @click="toggle"
    :color="colors.GRAY_700"
    :text-color="colors.GRAY_300"
    class="absolute right-3 aspect-square"
    style="margin-top: -61px;"
  >
    <CIcon icon="sync"></CIcon>
  </CButton>
  <TransitionMatrixDisplay :transition-matrix="currentTransitionMatrix" />
</template>
