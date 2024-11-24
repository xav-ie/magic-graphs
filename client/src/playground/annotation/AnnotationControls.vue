<script setup lang="ts">
  import { toRefs } from "vue";
  import colors from "@utils/colors";
  import Toolbar from "@product/graph-sandbox/Toolbar.vue";
  import ToolbarButton from "@product/graph-sandbox/ToolbarButton.vue";
  import ToolbarButtonDivider from "@product/graph-sandbox/ToolbarButtonDivider.vue";
  import ToolbarButtonGroup from "@product/graph-sandbox/ToolbarButtonGroup.vue";
  import {
    COLORS,
    BRUSH_WEIGHTS,
  } from "@graph/compositions/useAnnotationGraph/types";
  import type { Graph } from "@graph/types";

  const props = defineProps<{
    graph: Graph;
  }>();

  const { annotationColor, annotationBrushWeight } = toRefs(props.graph);
  const { clearAnnotations } = props.graph;
</script>

<template>
  <Toolbar>
    <ToolbarButtonGroup>
      <ToolbarButton
        v-for="color in COLORS"
        @click="annotationColor = color"
        :active="annotationColor === color"
        :key="color"
        :color="color"
      >
        <div :class="['rounded-full', 'p-[3px]']">
          <div :class="['w-6', 'h-6', 'rounded-full', `bg-[${color}]`]"></div>
        </div>
      </ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonDivider />

    <ToolbarButtonGroup>
      <ToolbarButton
        v-for="weight in BRUSH_WEIGHTS"
        @click="annotationBrushWeight = weight"
        :active="annotationBrushWeight === weight"
        :key="weight"
        :color="colors.TRANSPARENT"
      >
        <div
          :class="[
            'bg-gray-400',
            'rounded-md',
            'w-[15px]',
            `h-[${weight * 2}px]`,
          ]"
        ></div>
      </ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonDivider />

    <ToolbarButtonGroup class="gap-1">
      <ToolbarButton>mdi-eraser</ToolbarButton>

      <ToolbarButton @click="clearAnnotations">
        mdi-delete-outline
      </ToolbarButton>
    </ToolbarButtonGroup>
  </Toolbar>
</template>
