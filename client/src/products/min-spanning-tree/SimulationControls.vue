<script setup lang="ts">
import colors from '@utils/colors';
import Progressbar from '@ui/sim/Progressbar.vue';
import SimulationPlaybackControls from '@ui/sim/SimulationPlaybackControls.vue';
import type { MSTSimulationControls } from './useSimulation';

defineProps<{
  controls: MSTSimulationControls;
}>()
</script>

<template>
  <Progressbar
    class="w-[300px] border-gray-200 border-2 mb-8"
    :theme="{
      progressColor: colors.GRAY_200,
      backgroundColor: colors.SLATE_500,
      borderRadius: 20,
    }"
    :start-progress="0"
    :current-progress="controls.step.value"
    :end-progress="controls.trace.value.length"
  />
  <SimulationPlaybackControls :controls="controls" />
</template>
