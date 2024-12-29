<script setup lang="ts">
  import CIcon from "@ui/core/Icon.vue";
  import CPopover from "@ui/core/Popover.vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import InputRange from "@ui/InputRange.vue";
  import type { AutoGenerateGraphOptions } from "./types";

  const props = defineProps<{
    options: AutoGenerateGraphOptions;
    resetOptions: () => void;
  }>();

  const { options, resetOptions } = props;
</script>

<template>
  <CPopover :offset="-400"> 
    <template #activator="{ toggle }">
      <GButton @click="toggle">
        <CIcon icon="settings" />
      </GButton>
    </template>

    <GWell class="p-3 flex flex-col gap-2 w-72 rounded-lg">
        <h2 class="font-bold text-sm">Nodes ({{ options.maxNodesPerCluster }})</h2>
        <InputRange
            v-model="options.maxNodesPerCluster"
            :min="3"
            :max="50"
            class="w-full"
          />
        <h2 class="font-bold text-sm">Node spread ({{ options.clusterSpread }})</h2>
        <InputRange
            v-model="options.clusterSpread"
            :min="10"
            :max="500"
            class="w-full"
          />
        <h2 class="font-bold text-sm">Max edges per node ({{ options.maxEdgesPerNode }})</h2>
        <InputRange
            v-model="options.maxEdgesPerNode"
            :min="0"
            :max="10"
            class="w-full"
          />
        <h2 class="font-bold text-sm">Connection probability ({{ options.connectionProbability }})</h2>
        <InputRange
            v-model="options.connectionProbability"
            :min="0"
            :max="1"
            step="0.05"
            class="w-full"
          />
        <h2 class="font-bold text-sm">Edge connection distance ({{ options.maxNeighbors }})</h2>
        <InputRange
            v-model="options.maxNeighbors"
            :min="0"
            :max="50"
            class="w-full"
          />
        <GButton @click="resetOptions" >Reset</GButton>
    </GWell>

  </CPopover>
</template>