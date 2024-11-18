<script setup lang="ts">
  import type { FlowProperties } from "./useFlowProperties";

  defineProps<{
    flowProperties: FlowProperties;
  }>();
</script>

<template>
  <div class="flex gap-3">
    <span class="font-bold text-xl">
      Max Flow: {{ flowProperties.maxFlow ?? "N/A" }}
    </span>
  </div>
</template>
