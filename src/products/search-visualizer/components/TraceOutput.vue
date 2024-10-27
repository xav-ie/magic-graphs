<script setup lang="ts">
  import type { Trace } from "../types";
  defineProps<{
    trace: Trace;
    error: string;
  }>();
</script>

<template>
  <h1
    v-if="error"
    class="text-red-500 text-2xl font-bold"
  >
    {{ error }}
  </h1>
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
</template>
