<script setup lang="ts">
  import { ref, computed, watch } from "vue";
  import { useLocalStorage } from "@vueuse/core";
  import { useAdjacencyList } from "@graph/useAdjacencyList";
  import { useGraph } from "@graph/useGraph";
  import type { Trace } from "./types";
  import { algos } from "./algos";
  import CodeEditor from "./components/CodeEditor.vue";
  import TraceOutput from "./components/TraceOutput.vue";
  import Graph from "@graph/Graph.vue";

  const trace = ref<Trace>([]);

  const graphEl = ref<HTMLCanvasElement>();

  const graph = useGraph(graphEl, {
    settings: {
      persistentStorageKey: "search-visualizer-graph"
    },
  });

  const { labelAdjacencyList } = useAdjacencyList(graph);

  /**
   * a graph with traps to collect the traversal trace
   */
  const trappedGraph = computed(
    () =>
      new Proxy(labelAdjacencyList.value, {
        get(target, prop, receiver) {
          trace.value.push(prop.toString());
          if (trace.value.length > 100)
            throw new Error("Infinite loop detected");
          if (!Reflect.has(target, prop))
            throw new Error(`Node "${prop.toString()}" not found in graph`);
          return Reflect.get(target, prop, receiver);
        },
      })
  );

  const argName = "graph";
  const userFuncSig = `function traverse(${argName}) { // 🔒`;

  const getDecoratedAlgorithm = (algo: string) =>
    `${userFuncSig}\n  ${algo}\n}`;

  /**
   * the code that the user interacts with, including "decorations" like the function signature
   * and closing brackets
   */
  const decoratedAlgorithm = useLocalStorage(
    "userFn",
    getDecoratedAlgorithm(algos.BFS)
  );

  /**
   * extracts the runnable algorithm code from the decoration code
   */
  const algorithm = computed(() =>
    decoratedAlgorithm.value.split("\n").slice(1, -1).join("\n")
  );

  /**
   * creates an executable function from the algorithm code
   */
  const algorithmFunc = computed(() => new Function(argName, algorithm.value));

  /**
   * stores any errors that occur during algorithm execution.
   * User facing, so it should be a legible string
   */
  const algorithmError = ref("");

  /**
   * runs the algorithm on the graph and collects the traversal trace + any errors
   */
  const runAlgorithm = () => {
    try {
      algorithmError.value = "";
      trace.value = [];
      algorithmFunc.value(trappedGraph.value);
    } catch (error) {
      if (error && error instanceof Error)
        algorithmError.value = `${error.name}: ${error.message}`;
      else algorithmError.value = "An unknown error occurred";
    }
  };

  watch(decoratedAlgorithm, runAlgorithm);
  watch(trappedGraph, runAlgorithm);
</script>

<template>
  <div class="w-full h-full relative">

    <!-- graph -->
    <div class="h-[50%] relative">
      <Graph
        @graph-ref="(el) => graphEl = el"
        :graph="graph"
      />
      <!-- switch out algorithm -->
      <div
        :class="[
          'absolute',
          'bottom-0',
          'h-[5%]',
          'flex',
          'items-center',
          'gap-3',
          'pb-7',
          'pl-3',
          'select-none',
        ]"
      >
        <button
          v-for="(algo, algoName) in algos"
          @click="decoratedAlgorithm = getDecoratedAlgorithm(algo)"
          :key="algoName"
          :class="[
            'text-white',
            'bg-gray-800',
            'px-5',
            'py-1',
            'font-bold',
            'text-md',
            'rounded-full',
            'hover:bg-gray-900',
            'focus:bg-gray-900',
          ]"
        >
          {{ algoName }}
        </button>
      </div>
    </div>

    <!-- code editor -->
    <div class="h-[45%] text-lg">
      <CodeEditor v-model="decoratedAlgorithm" />
    </div>

    <!-- traversal trace output -->
    <div class="absolute bottom-0 h-[10%] w-full">
      <TraceOutput
        :trace="trace"
        :error="algorithmError"
      />
    </div>
  </div>
</template>
