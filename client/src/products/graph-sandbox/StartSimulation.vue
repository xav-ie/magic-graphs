<script setup lang="ts">
  import colors from "@utils/colors";
  import type { SimulationDeclaration } from "src/types";

  defineProps<{
    simulations: SimulationDeclaration[];
    startSimulation: (simulation: SimulationDeclaration) => void;
  }>();
</script>

<template>
  <v-menu :offset="[10, 0]">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        icon="mdi-play"
        size="large"
        :color="colors.GRAY_800"
      ></v-btn>
    </template>

    <div class="bg-gray-800 flex flex-col text-white p-2 w-[400px] rounded-lg">
      <button
        v-for="simulation in simulations"
        :key="simulation.name"
        @click="startSimulation(simulation)"
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
