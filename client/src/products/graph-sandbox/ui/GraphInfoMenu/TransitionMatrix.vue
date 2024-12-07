<script setup lang="ts">
  import TransitionMatrixDisplay from "./TransitionMatrixDisplay.vue";
  import GWell from "@ui/graph/GWell.vue";
</script>

<template>
  <h2 class="text-xl font-bold mb-2 mt-5">Transition Matrix</h2>
  <GWell secondary class="p-4 rounded-lg max-h-[300px] overflow-auto">
    <TransitionMatrixDisplay />
  </GWell>
</template>
