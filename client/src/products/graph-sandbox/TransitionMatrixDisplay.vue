<script setup lang="ts">
import type { TransitionMatrix } from "@graph/useTransitionMatrix";
import colors from "@colors";

defineProps<{
  transitionMatrix: TransitionMatrix;
}>();

const brackets = `
  background: linear-gradient(${colors.GRAY_700}, ${colors.GRAY_700}) 50% 50%/calc(100% - 10px) calc(100% - 10px) no-repeat,
  linear-gradient(90deg, ${colors.WHITE} 10%, ${colors.TRANSPARENT} 10%, ${colors.TRANSPARENT} 90%, ${colors.WHITE} 90%) 188% 0;
`;
</script>

<template>
  <div class="flex py-6 items-center">
    <div class="text-xl font-bold px-5 text-nowrap">T =</div>
    <div class="p-4 rounded" :style="brackets">
      <div
        v-for="(row, rowIndex) in transitionMatrix"
        :key="'row-' + rowIndex"
        class="flex"
      >
        <div
          v-for="(col, colIndex) in row"
          :key="'col-' + colIndex"
          class="text-gray-300 text-sm font-bold text-center flex items-center justify-center w-12 h-12"
          style="overflow: hidden"
        >
          {{ col.toPrecision(2) }}
        </div>
      </div>
    </div>
    <div class="text-gray-700">block</div>
  </div>
</template>
