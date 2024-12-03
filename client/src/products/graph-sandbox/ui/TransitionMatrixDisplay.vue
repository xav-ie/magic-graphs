<script setup lang="ts">
  import colors from "@colors";
  import { graph } from "@graph/global";
  import { useTransitionMatrix } from "@graph/useTransitionMatrix";
import GraphNode from "@ui/graph/GraphNode.vue";

  const { transitionMatrix } = useTransitionMatrix(graph.value);

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
          class="text-gray-300 text-sm font-bold text-center flex items-center justify-center w-12 h-12"
          style="overflow: hidden"
        >
          <v-tooltip
            activator="parent"
            location="top"
          >
            <div class="flex items-center">
              <GraphNode :size="30">{{ graph.nodes.value[rowIndex].label }}</GraphNode>
              <v-icon>mdi-arrow-right</v-icon>
              <GraphNode :size="30">{{ graph.nodes.value[colIndex].label }}</GraphNode>
            </div>
          </v-tooltip>
          {{ Math.round(col * 10) / 10 }}
        </div>
      </div>
    </div>
    <div class="text-gray-700">block</div>
  </div>
</template>
