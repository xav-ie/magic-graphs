<script setup lang="ts">
import colors from '@utils/colors';
import Progressbar from '@ui/product/sim/ProgressBar.vue';
import SimulationPlaybackControls from '@ui/product/sim/SimulationPlaybackControls.vue';
import type { MSTSimulationControls } from './useSimulation';

defineProps<{
  controls: MSTSimulationControls;
}>()
</script>

<template>
  <SimulationPlaybackControls :controls="controls" />
</template>
