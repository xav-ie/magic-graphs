<script setup lang="ts">
  import { ref } from "vue";
  import type { SimulationDeclaration } from "src/types";
  import GVerticalCardButton from "@ui/graph/button/GVerticalCardButton.vue";
  import { getRandomInRange } from "@utils/random";

  const props = defineProps<{
    simulation: SimulationDeclaration;
  }>();

  const img = ref("");
  setTimeout(() => {
    img.value = props.simulation.thumbnail;
  }, getRandomInRange(0, 100));
</script>

<template>
  <GVerticalCardButton
    :image-src="img"
    :title="simulation.name"
    :description="simulation.description"
    class="rounded-md"
  />
</template>
