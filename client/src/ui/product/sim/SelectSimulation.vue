<script setup lang="ts">
  import { computed } from "vue";
  import type { SimulationDeclaration } from "src/types";
  import GButton from "@ui/graph/button/GButton.vue";
  import CPopover from "@ui/core/Popover.vue";
  import CIcon from "@ui/core/Icon.vue";
  import GWell from "@ui/graph/GWell.vue";
  import GVerticalCardButton from "@ui/graph/button/GVerticalCardButton.vue";

  const props = defineProps<{
    simulations: SimulationDeclaration[];
  }>();

  const emits = defineEmits<{
    (e: "simulation-selected", simulation: SimulationDeclaration): void;
  }>();

  const reasonNotToRun = (sim: SimulationDeclaration) => {
    const reason = sim.canRun?.();
    if (typeof reason === "string") return reason;
  }

  const displayedSimulations = computed(() => {
    const allSimulations = props.simulations;
    const cannotRun = allSimulations.filter(reasonNotToRun);
    const canRun = allSimulations.filter((sim) => !reasonNotToRun(sim));
    return [...canRun, ...cannotRun];
  });
</script>

<template>
  <CPopover>
    <template #activator="{ toggle }">
      <GButton
        @click="toggle"
        class="h-14 w-14 rounded-full"
      >
        <CIcon
          class="text-3xl"
          icon="play_arrow"
        />
      </GButton>
    </template>

    <GWell class="flex flex-col p-2 w-[400px] gap-1 rounded-lg">
      <div
        v-for="simulation in displayedSimulations"
        :key="simulation.name"
        class="relative"
      >
        <div
          v-if="reasonNotToRun(simulation)"
          class="absolute bg-black w-full h-full z-10 rounded-md bg-opacity-50 grid place-items-center"
        >
          <h2 class="text-red-500 font-bold text-lg bg-gray-900 rounded-lg px-2 py-1">
            {{ reasonNotToRun(simulation) }}
          </h2>
        </div>

        <GVerticalCardButton
          @click="emits('simulation-selected', simulation)"
          class="rounded-md"
          :image-src="simulation.thumbnail"
          :title="simulation.name"
          :description="simulation.description"
        />
      </div>
    </GWell>
  </CPopover>
</template>
