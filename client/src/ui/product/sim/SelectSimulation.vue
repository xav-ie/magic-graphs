<script setup lang="ts">
  import type { SimulationDeclaration } from "src/types";
  import GButton from "@ui/graph/button/GButton.vue";
  import CPopover from "@ui/core/Popover.vue";
  import CIcon from "@ui/core/Icon.vue";
  import GWell from "@ui/graph/GWell.vue";
  import GVerticalCardButton from "@ui/graph/button/GVerticalCardButton.vue";

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

    <GWell class="flex flex-col p-2 w-[400px] rounded-lg">
      <GVerticalCardButton
        v-for="simulation in simulations"
        @click="emits('simulation-selected', simulation)"
        :key="simulation.name"
        :image-src="simulation.thumbnail"
        :title="simulation.name"
        :description="simulation.description"
      />
    </GWell>
  </CPopover>
</template>
