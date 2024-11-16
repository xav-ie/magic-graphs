<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import type { SimulationControls } from "@ui/sim/types";
  import type { ProductInfo, SimulationDeclaration } from "src/types";
  import { ref } from "vue";

  const props = defineProps<{
    graph: Graph;
  }>();

  const infoModules = import.meta.glob<{
    default: ProductInfo;
  }>("/src/**/info.ts", { eager: true });

  const productInfo = Object.values(infoModules).map(
    (module) => module.default
  );

  const activeSimulation = ref<SimulationControls>();

  const simulations = productInfo
    .map((info) => info.simulations)
    .filter(Boolean)
    .flat() as SimulationDeclaration[];

  const startSimulation = (simulation: SimulationDeclaration) => {
    activeSimulation.value = simulation.controls(props.graph);
    activeSimulation.value.start();
  };

  const stopSimulation = () => {
    activeSimulation.value?.stop();
    activeSimulation.value = undefined;
  };
</script>

<template>
  <div class="bg-gray-800 text-white p-5 rounded-xl">
    <h1 class="text-2xl">Simulations</h1>
    <div class="flex flex-col gap-2">
      <button
        v-for="simulation in simulations"
        @click="startSimulation(simulation)"
        class="bg-blue-500 p-1 px-3 mt-4 text-lg"
      >
        {{ simulation.name }}
      </button>
    </div>
    <button
      @click="stopSimulation"
      class="bg-red-500 p-1 px-3 mt-4 text-lg"
    >
      Stop
    </button>
  </div>
</template>
