<script setup lang="ts">
  import AdjacencyListDisplay from './AdjacencyListDisplay.vue';
</script>

<template>
  <h2 class="text-xl font-bold text-gray-200 mb-2">Adjacency List</h2>
  <div class="bg-gray-700 p-4 rounded-lg max-h-[200px] overflow-auto">
    <AdjacencyListDisplay />
  </div>
</template>