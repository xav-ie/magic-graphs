<script setup lang="ts">
  import { computed } from "vue";
  import type { SimulationDeclaration } from "src/types";
  import CButton from "@ui/core/button/Button.vue";

  const props = defineProps<{
    simulation: SimulationDeclaration;
  }>();

  const reason = computed(() => props.simulation.canRun?.check());
</script>

<template>
  <div
    v-if="reason"
    class="absolute bg-black w-full h-full z-10 rounded-md bg-opacity-50 grid place-items-center"
  >
    <h2 class="text-red-500 font-bold text-lg bg-gray-900 rounded-lg px-2 py-1">
      {{ reason.title }}
    </h2>
  </div>
</template>
