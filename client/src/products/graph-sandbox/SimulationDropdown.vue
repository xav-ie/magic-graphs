<script setup lang="ts">
  import { ref } from "vue";
  import type { Graph } from "@graph/types";
  import colors from "@utils/colors";
  import type {
    ProductInfo,
    SimulationDeclaration,
    SimulationDeclarationGetter,
  } from "src/types";
  import StartSimulation from "./StartSimulation.vue";
  import type { SimulationControls } from "@ui/sim/types";

  const props = defineProps<{
    graph: Graph;
  }>();

  /**
   * defined when the user is running a simulation in the sandbox
   */
  const activeSimulationDeclaration = ref<SimulationDeclaration>();
  /**
   * an instance of controls for the active simulation (above)
   */
  const activeSimulationControls = defineModel<SimulationControls>();

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
    const { setup, controls } = simulation;
    await setup?.();
    const simControls = await controls();
    simControls.start();
    activeSimulationDeclaration.value = simulation;
    activeSimulationControls.value = simControls;
  };

  const stopSimulation = async () => {
    if (!activeSimulationDeclaration.value) return;
    if (!activeSimulationControls.value) throw new Error("active sim, but no controls");
    activeSimulationControls.value.stop();

    const { cleanup } = activeSimulationDeclaration.value;
    await cleanup?.();

    activeSimulationDeclaration.value = undefined;
    activeSimulationControls.value = undefined;
  };
</script>

<template>
  <div>
    <StartSimulation
      v-if="!activeSimulationDeclaration"
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
