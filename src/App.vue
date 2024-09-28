<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { implementations } from './implementations';
import { Codemirror } from 'vue-codemirror';
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import readOnlyRangesExtension from 'codemirror-readonly-ranges';

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

const userFn = useLocalStorage('userFn', 'return graph');
const argName = useLocalStorage('argName', 'graph');

const userFnError = ref('');

const fn = computed(() => {
  return new Function(argName.value, userFn.value);
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
      <button
        v-for="(val, key) in implementations"
        :key="key"
        class="bg-blue-600 px-10 py-2 font-bold text-xl rounded-full mb-2 hover:bg-blue-800"
        @click="userFn = val"
      >
        {{ key.toUpperCase() }}
      </button>
    </div>
    <h2 class="text-xl">
      function traverse(
      <input v-model="argName" class="outline-none bg-transparent w-auto"/>) {
        <br>
        <!-- <textarea v-model="userFn" placeholder="javascript here" class="bg-gray-800 h-96 w-2/3 ml-8 outline-none px-2 py-1" /> -->
        <codemirror
          v-model="userFn"
          mode="javascript"
          :tabSize="2"
          :extensions="[javascript(), oneDark]"
          :style="{
            background: 'gray',
            height: '500px',
          }"
          />
        <br>
      }
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

<style scoped>

</style>