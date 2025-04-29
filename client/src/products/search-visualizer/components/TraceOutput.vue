<script setup lang="ts">
  import type { Trace } from '../types';
  defineProps<{
    trace?: Trace;
    error: string;
  }>();
</script>

<template>
  <div
    class="h-full w-full rounded-t-2xl flex items-center gap-4 bg-gray-900 text-white pl-8"
  >
    <h1
      v-if="error"
      class="text-red-500 text-2xl font-bold"
    >
      {{ error }}
    </h1>
    <div
      v-else-if="!trace"
      class="text-yellow-500 text-2xl font-bold animate-pulse"
    >
      Please wait...
    </div>
    <div
      v-else
      class="text-2xl font-bold flex"
    >
      Start → &nbsp;
      <h1
        v-for="node in trace"
        :key="node"
      >
        <span class="border-4 border-white p-2 rounded-full px-4">
          {{ node }}
        </span>
        → &nbsp;
      </h1>
      End
    </div>
  </div>
</template>
