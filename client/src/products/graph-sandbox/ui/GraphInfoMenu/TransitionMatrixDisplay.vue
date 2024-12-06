<script setup lang="ts">
  import { computed } from "vue";
  import colors from "@colors";
  import { graph } from "@graph/global";
  import type { TransitionMatrix } from "@graph/useTransitionMatrix";
  import TransitionMatrixLabel from "./TransitionMatrixLabel.vue";


  const props = defineProps<{ 
    transitionMatrix: TransitionMatrix 
  }>()

  const brackets = {
    background: `
      linear-gradient(
        ${colors.GRAY_700},
        ${colors.GRAY_700}
      )
      50%
      50%/calc(100% - 10px)
      calc(100% - 10px) no-repeat,
      linear-gradient(
        90deg,
        ${colors.WHITE}
        10%,
        ${colors.TRANSPARENT}
        10%,
        ${colors.TRANSPARENT}
        90%,
        ${colors.WHITE}
        90%
      )
      188%
      0`,
  };

  const nodes = computed(() => graph.value.nodes.value);
</script>

<template>
  <div
    v-if="transitionMatrix.length !== 0"
    class="flex py-6 items-center"
  >
    <div class="text-xl font-bold px-5 text-nowrap">T =</div>
    <div
      :style="brackets"
      class="p-4 rounded"
    >
      <div
        v-for="(row, rowIndex) in transitionMatrix"
        :key="'row-' + rowIndex"
        class="flex"
      >
        <div
          v-for="(col, colIndex) in row"
          :key="'col-' + colIndex"
        >
          <TransitionMatrixLabel
            :toNode="nodes[rowIndex]"
            :fromNode="nodes[colIndex]"
            :weight="col"
          />
        </div>
      </div>
    </div>
    <div class="text-gray-700 select-none">block</div>
  </div>
</template>
