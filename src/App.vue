<script setup lang="ts">
import { ref } from 'vue';
import Graph from './Graph.vue';
import CodeEditor from './CodeEditor.vue';

const weightedGraph = {
  1: [{ node: 2, weight: 4 }, { node: 4, weight: 2 }],
  2: [{ node: 3, weight: 3 }],
  3: [],
  4: [{ node: 5, weight: 3 }, { node: 7, weight: 2 }],
  5: [{ node: 6, weight: 1 }],
  6: [{ node: 4, weight: 1 }],
  7: [{ node: 6, weight: 1 }],
}

const graph = ref<Record<number, number[]>>({
  1: [2, 4],
  2: [3],
  3: [],
  4: [5, 7],
  5: [6],
  6: [4],
  7: [6],
})

</script>

<template>
  <div class="bg-[#282c34] w-[100vw] h-[100vh] text-white relative">
    <Graph v-model="graph" />
    <CodeEditor :graph="graph" />
  </div>
</template>