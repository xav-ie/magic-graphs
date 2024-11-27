<script setup lang="ts">
  import type { SimulationDeclaration } from "src/types";
  import StartSimButton from "@ui/product/StartSimButton.vue";

  defineProps<{
    simulations: SimulationDeclaration[];
  }>();

  const activeSimulation = defineModel<SimulationDeclaration>();

  const startSimulation = async (simulation: SimulationDeclaration) => {
    const { runner } = simulation;
    activeSimulation.value = simulation;

    await runner.start();
  };
</script>

<template>
  <v-menu :offset="[10, 0]">
    <template #activator="{ props }">
      <StartSimButton v-bind="props" />
    </template>

    <div class="bg-gray-800 flex flex-col text-white p-2 w-[400px] rounded-lg">
      <button
        v-for="simulation in simulations"
        @click="startSimulation(simulation)"
        :key="simulation.name"
        class="hover:bg-gray-900 p-2 rounded-md cursor-pointer rounded-lg text-left flex gap-4"
      >
        <img
          :src="simulation.thumbnail"
          class="object-cover h-20 w-20 rounded-md"
        />
        <div class="flex flex-col gap-1">
          <h1 class="text-lg font-bold text-gray-200">
            {{ simulation.name }}
          </h1>
          <p class="text-sm text-gray-400">
            {{ simulation.description }}
          </p>
        </div>
      </button>
    </div>
  </v-menu>
</template>
