<script setup lang="ts">
import { useFlowProperties } from './useFlowProperties';
import type { Graph } from '@graph/types';

const props = defineProps<{
  graph: Graph;
}>()

const { maxFlow } = useFlowProperties(props.graph);
</script>

<template>
  <div class="flex gap-3">
    <span class="font-bold text-xl">Max Flow: {{ maxFlow ?? "N/A" }}</span>
  </div>
</template>