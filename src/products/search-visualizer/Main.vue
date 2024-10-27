<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { AdjacencyList } from '@graph/converters';
import type { Trace } from './types';
import { algos } from './algos';
import CodeEditor from './components/CodeEditor.vue';
import TraceOutput from './components/TraceOutput.vue';

const trace = ref<Trace>([]);

const props = defineProps<{
  graph: AdjacencyList;
}>();

const graphProxy = computed(() => new Proxy({ ...props.graph }, {
  get(target, prop, receiver) {
    trace.value.push(prop);
    if (trace.value.length > 100) throw new Error('Infinite loop detected');
    if (!Reflect.has(target, prop)) throw new Error(`Node "${prop.toString()}" not found in graph`);
    return Reflect.get(target, prop, receiver);
  }
}));

const argName = 'graph';
const userFuncSig = `function traverse(${argName}) { // 🔒`;

const getDecoratedAlgorithm = (algo: string) => `${userFuncSig}\n  ${algo}\n}`;

/**
 * the code that the user interacts with, including "decorations" like the function signature
 * and closing brackets
 */
const decoratedAlgorithm = useLocalStorage('userFn', getDecoratedAlgorithm(algos.BFS));

/**
 * extracts the runnable algorithm code from the decoration code
 */
const algorithm = computed(() => decoratedAlgorithm.value.split('\n').slice(1, -1).join('\n'));

/**
 * creates an executable function from the algorithm code
 */
const algorithmFunc = computed(() => new Function(argName, algorithm.value));

/**
 * stores any errors that occur during algorithm execution.
 * User facing, so it should be a legible string
 */
const algorithmError = ref('');

/**
 * runs the algorithm on the graph and collects the traversal trace + any errors
 */
const runAlgorithm = () => {
  try {
    algorithmError.value = '';
    trace.value = [];
    algorithmFunc.value(graphProxy.value);
  } catch (error) {
    if (error && error instanceof Error) algorithmError.value = `${error.name}: ${error.message}`
  }
}

watch(decoratedAlgorithm, runAlgorithm);
watch(graphProxy, runAlgorithm);
</script>

<template>

  <!-- switch out algorithm -->
  <div class="flex gap-3 px-3 py-2 bg-[#282c34]">
    <button
      v-for="(val, key) in algos"
      @click="decoratedAlgorithm = getDecoratedAlgorithm(val)"
      :key="key"
      class="bg-gray-700 px-5 py-1 font-bold text-md rounded-full hover:bg-gray-800"
    >
      {{ key }}
    </button>
  </div>

  <!-- code editor -->
  <CodeEditor />

  <!-- traversal trace output -->
  <div class="px-6 py-2 bg-gray-900 pt-8 pb-12 rounded-t-2xl">
    <TraceOutput
      :trace="trace"
      :error="algorithmError"
    />
  </div>

</template>