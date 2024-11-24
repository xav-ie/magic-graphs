<script setup lang="ts">
import type { AdjacencyList } from '@graph/useAdjacencyList';

defineProps<{
  adjacencyList: AdjacencyList;
}>()
</script>

<template>
  <div>
    {{ adjacencyList }}
  </div>
</template>