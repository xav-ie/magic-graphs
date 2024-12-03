<script setup lang="ts">
  import {
    COLORS,
    BRUSH_WEIGHTS,
  } from "@graph/plugins/annotation/types";
  import { graph } from "@graph/global";
  import colors, { type Color } from "@utils/colors";
  import Toolbar from "./toolbar/Toolbar.vue";
  import ToolbarButton from "./toolbar/ToolbarButton.vue";
  import ToolbarButtonDivider from "./toolbar/ToolbarButtonDivider.vue";
  import ToolbarButtonGroup from "./toolbar/ToolbarButtonGroup.vue";

  const { clearAnnotations } = graph.value;

  const selectColor = (color: string) => {
    graph.value.annotationColor.value = color;
    graph.value.annotationErasing.value = false;
  };

  const selectBrushWeight = (brushWeight: number) => {
    graph.value.annotationBrushWeight.value = brushWeight;
  };

  const isColorActive = (color: Color) => {
    const erasing = graph.value.annotationErasing.value;
    if (erasing) return false;
    return graph.value.annotationColor.value === color;
  }

  const isBrushWeightActive = (brushWeight: number) => {
    return graph.value.annotationBrushWeight.value === brushWeight;
  }

  const toggleErasing = () => {
    graph.value.annotationErasing.value = !graph.value.annotationErasing.value;
  }
</script>

<template>
  <Toolbar>
    <ToolbarButtonGroup>
      <ToolbarButton
        v-for="color in COLORS"
        @click="selectColor(color)"
        :active="isColorActive(color)"
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
        v-for="(weight, index) in BRUSH_WEIGHTS"
        @click="selectBrushWeight(weight)"
        :active="isBrushWeightActive(weight)"
        :key="weight"
        :color="colors.TRANSPARENT"
      >
        <div
          :class="[
            'bg-gray-400',
            'rounded-md',
            'w-[15px]',
            `h-[${index * 5 + 1}px]`,
          ]"
        ></div>
      </ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonDivider />

    <ToolbarButtonGroup class="gap-1">
      <ToolbarButton
        @click="toggleErasing"
        :active="graph.annotationErasing.value"
      >
        mdi-eraser
      </ToolbarButton>

      <ToolbarButton @click="clearAnnotations">
        mdi-delete-outline
      </ToolbarButton>
    </ToolbarButtonGroup>
  </Toolbar>
</template>
