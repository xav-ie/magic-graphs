<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { implementations } from './implementations';
import { Codemirror } from 'vue-codemirror';
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import readOnlyRangesExtension from 'codemirror-readonly-ranges';
import type { EditorState } from '@codemirror/state';

const graph = {
  1: [2, 4],
  2: [3],
  3: [],
  4: [5, 7],
  5: [6],
  6: [4],
  7: [6],
}

const weightedGraph = {
  1: [{ node: 2, weight: 4 }, { node: 4, weight: 2 }],
  2: [{ node: 3, weight: 3 }],
  3: [],
  4: [{ node: 5, weight: 3 }, { node: 7, weight: 2 }],
  5: [{ node: 6, weight: 1 }],
  6: [{ node: 4, weight: 1 }],
  7: [{ node: 6, weight: 1 }],
}

const trace = ref<any[]>([]);

const graphProxy = new Proxy(graph, {
  get(target, prop, receiver) {
    trace.value.push(prop);
    return Reflect.get(target, prop, receiver);
  }
});

const argName = 'graph';
const userFuncSig = `function traverse(${argName}) { // 🔒`;

const getReadOnlyRanges = (targetState: EditorState) => ([
  {
    from: undefined,
    to: targetState.doc.line(1).to
  },
  {
    from: targetState.doc.line(targetState.doc.lines - 1).to,
    to: undefined
  }
])

const userFn = useLocalStorage('userFn', 'return graph');
const userFnError = ref('');

const runner = () => {
  try {
    const fn = new Function(argName,
      userFn
        .value
        .split('\n')
        .slice(1, -1)
        .join('\n'))
    userFnError.value = '';
    trace.value = [];
    fn(graphProxy);
  } catch (e) {
    if (e instanceof Error) {
      userFnError.value = `${e.name}: ${e.message}`;
    } else {
      userFnError.value = 'An error occurred while running the function';
    }
  }
}

watch(userFn, runner, { immediate: true });
</script>

<template>
  <div class="flex gap-3 px-3 py-2 bg-[#282c34]">
    <button v-for="(val, key) in implementations" :key="key"
      class="bg-gray-700 px-5 py-1 font-bold text-md rounded-full hover:bg-gray-800"
      @click="userFn = `${userFuncSig}\n  ${val}\n}`">
      {{ key }}
    </button>
  </div>
  <h2 class="text-xl">
    <codemirror
      v-model="userFn"
      :tabSize="2"
      :extensions="[javascript(), oneDark, readOnlyRangesExtension(getReadOnlyRanges)]"
      :style="{
        background: 'gray',
        height: '50%',
      }"
    />
  </h2>
  <div class="px-4 py-2 bg-gray-900 pt-8 pb-12">
    <h1 v-if="userFnError" class="text-red-500 text-2xl font-bold">
      {{ userFnError }}
    </h1>
    <div v-else class="text-2xl font-bold flex">
      Start → &nbsp;
      <h1 v-for="nodeId in trace" :key="nodeId">
        <span class="border-4 border-white p-2 rounded-full px-4">
          {{ nodeId }}
        </span>
         → &nbsp;
      </h1>
      End
    </div>
  </div>
</template>

<style scoped></style>