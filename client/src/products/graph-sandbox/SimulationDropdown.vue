<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import colors from "@utils/colors";
  import type {
    ProductInfo,
    SimulationDeclaration,
    SimulationDeclarationGetter,
  } from "src/types";
  import StartSimulation from "./StartSimulation.vue";

  const props = defineProps<{
    graph: Graph;
  }>();

  /**
   * actively running simulation, as selected by the user
   */
  const activeSimulation = defineModel<SimulationDeclaration>();

  const infoModules = import.meta.glob<{
    default: ProductInfo;
  }>("/src/**/info.ts", { eager: true });

  const productInfo = Object.values(infoModules).map(
    (module) => module.default
  );

  const simulationDeclarationGetters = productInfo
    .map((info) => info.simulations)
    .filter(Boolean) as SimulationDeclarationGetter[];

  const simulations = simulationDeclarationGetters
    .map((getter) => getter(props.graph))
    .flat();

  const startSimulation = async (simulation: SimulationDeclaration) => {
    const { controls, onInit } = simulation;
    await onInit?.();
    controls.start();

    activeSimulation.value = simulation;
  };

  const stopSimulation = async () => {
    if (!activeSimulation.value) return;

    const { controls, onDismiss } = activeSimulation.value;
    controls.stop();
    await onDismiss?.();

    activeSimulation.value = undefined;
  };
</script>

<template>
  <div>
    <StartSimulation
      v-if="!activeSimulation"
      :simulations="simulations"
      :start-simulation="startSimulation"
    />
    <v-btn
      v-else
      @click="stopSimulation"
      :color="colors.RED_600"
      icon="mdi-stop"
      size="large"
    ></v-btn>
  </div>
</template>
