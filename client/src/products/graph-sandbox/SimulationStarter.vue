<script setup lang="ts">
  import type { SimulationDeclaration } from "src/types";
  import StartSimulation from "./StartSimulation.vue";

  defineProps<{
    simulations: SimulationDeclaration[];
  }>();

  /**
   * actively running simulation, as selected by the user
   */
  const activeSimulation = defineModel<SimulationDeclaration>();

  const startSimulation = async (simulation: SimulationDeclaration) => {
    const { runner } = simulation;
    activeSimulation.value = simulation;

    await runner.start();
  };
</script>

<template>
  <StartSimulation
    :simulations="simulations"
    :start-simulation="startSimulation"
  />
</template>
