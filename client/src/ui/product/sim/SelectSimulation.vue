<script setup lang="ts">
  import type { SimulationDeclaration } from "src/types";
  import CPopover from "@ui/core/Popover.vue";
  import CIcon from "@ui/core/Icon.vue";

  defineProps<{
    simulations: SimulationDeclaration[];
  }>();

  const emits = defineEmits<{
    (e: "simulation-selected", simulation: SimulationDeclaration): void;
  }>();
</script>

<template>
  <CPopover>
    <template #activator="{ toggle }">
      <button
        @click="toggle"
        class="bg-gray-800 hover:bg-gray-700 transition duration-100 grid place-items-center h-14 w-14 rounded-full"
      >
        <CIcon
          class="text-white text-3xl"
          icon="play_arrow"
        />
      </button>
    </template>

    <div class="bg-gray-800 flex flex-col text-white p-2 w-[400px] rounded-lg">
      <button
        v-for="simulation in simulations"
        @click="emits('simulation-selected', simulation)"
        :key="simulation.name"
        class="hover:bg-gray-900 p-2 rounded-md cursor-pointer text-left flex gap-4"
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
  </CPopover>
</template>
