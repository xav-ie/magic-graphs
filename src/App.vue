<script setup lang="ts">
import { ref, computed } from 'vue';
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
  4: [5],
  5: [6],
  6: []
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

const fn = computed(() => {
  return new Function(argName, userFn.value);
});

const runner = () => {
  userFnError.value = '';
  trace.value = [];
  try {
    fn.value(graphProxy);
  } catch (e) {
    if (e instanceof Error) {
      userFnError.value = `${e.name}: ${e.message}`;
    } else {
      userFnError.value = 'An error occurred while running the function';
    }
  }
}
</script>

<template>
  <div class="bg-gray-600 w-[100vw] h-[100vh] p-10 text-white">
    <div class="flex gap-3">
      <button v-for="(val, key) in implementations" :key="key"
        class="bg-blue-600 px-10 py-2 font-bold text-xl rounded-full mb-2 hover:bg-blue-800"
        @click="userFn = `${userFuncSig}\n  ${val}\n}`">
        {{ key.toUpperCase() }}
      </button>
    </div>
    <h2 class="text-xl">
      <codemirror v-model="userFn" mode="javascript" :tabSize="2"
        :extensions="[javascript(), oneDark, readOnlyRangesExtension(getReadOnlyRanges)]" :style="{
          background: 'gray',
          height: '500px',
        }" />
    </h2>
    <button @click="runner" class="bg-blue-500 px-10 py-2 font-bold text-2xl rounded-full mt-5 hover:bg-blue-600">
      Run
    </button>
    <div v-if="userFnError" class="text-red-500 mt-2 text-2xl font-bold">
      {{ userFnError }}
    </div>
    {{ trace }}
  </div>
</template>

<style scoped></style>