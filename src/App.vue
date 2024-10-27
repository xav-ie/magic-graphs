<script setup lang="ts">
import { ref } from 'vue';
import TestGraph from './TestGraph.vue';

const graph = ref()
</script>

<template>
  <div class="w-[100vw] h-[100vh] relative">
    <TestGraph v-model="graph" />
  </div>
</template>

<style>
/* class for exclusive use by useGraphTutorial, should be move out to css file at some point */
.element-highlight {
  animation: highlight 1s infinite;
}

@keyframes highlight {
  0% {
    background-color: #f6ad55;
  }
  50% {
    background-color: #ed8936;
  }
  100% {
    background-color: #f6ad55;
  }
}
</style>