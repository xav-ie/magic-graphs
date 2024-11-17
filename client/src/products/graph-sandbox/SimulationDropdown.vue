<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import type { SimulationControls } from "@ui/sim/types";
  import colors from "@utils/colors";
  import type { ProductInfo, SimulationDeclaration } from "src/types";
  import StartSimulation from "./StartSimulation.vue";

  const props = defineProps<{
    graph: Graph;
  }>();

  const activeSimulation = defineModel<SimulationControls>();

  const infoModules = import.meta.glob<{
    default: ProductInfo;
  }>("/src/**/info.ts", { eager: true });

  const productInfo = Object.values(infoModules).map(
    (module) => module.default
  );

  const simulations = productInfo
    .map((info) => info.simulations)
    .filter(Boolean)
    .flat() as SimulationDeclaration[];

  const startSimulation = (simulation: SimulationDeclaration) => {
    const controls = simulation.controls(props.graph);
    controls.start();
    activeSimulation.value = controls;
  };

  const stopSimulation = () => {
    activeSimulation.value?.stop();
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
