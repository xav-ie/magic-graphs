<script setup lang="ts">
  import type { SimulationDeclaration } from "src/types";
  import colors from "@utils/colors";

  /**
   * actively running simulation, as selected by the user
   */
  const activeSimulation = defineModel<SimulationDeclaration>();

  const stopSimulation = async () => {
    if (!activeSimulation.value) return;

    const { runner } = activeSimulation.value;
    await runner.stop();

    console.log("Simulation stopped");
    activeSimulation.value = undefined;
  };
</script>

<template>
  <v-btn
    @click="stopSimulation"
    :color="colors.RED_600"
    icon="mdi-stop"
    size="large"
  ></v-btn>
</template>
