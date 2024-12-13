<script setup lang="ts">
  import { COLORS, BRUSH_WEIGHTS } from "@graph/plugins/annotations/constants";
  import { graph } from "@graph/global";
  import type { Color } from "@utils/colors";
  import GToolbar from "@ui/graph/toolbar/GToolbarBase.vue";
  import GToolbarButton from "@ui/graph/toolbar/GToolbarButton.vue";
  import GToolbarButtonDivider from "@ui/graph/toolbar/GToolbarDivider.vue";
  import ToolbarButtonGroup from "@ui/core/toolbar/ToolbarButtonGroup.vue";

  const {
    clearAnnotations,
    annotationBrushWeight,
    annotationErasing,
    annotationColor,
  } = graph.value.annotation;

  const selectColor = (color: Color) => {
    annotationColor.value = color;
    annotationErasing.value = false;
  };

  const selectBrushWeight = (brushWeight: number) => {
    annotationBrushWeight.value = brushWeight;
  };

  const isColorActive = (color: Color) => {
    if (annotationErasing.value) return false;
    return annotationColor.value === color;
  };

  const isBrushWeightActive = (brushWeight: number) => {
    return annotationBrushWeight.value === brushWeight;
  };

  const toggleErasing = () => {
    annotationErasing.value = !annotationErasing.value;
  };
</script>

<template>
  <GToolbar>
    <ToolbarButtonGroup>
      <GToolbarButton
        v-for="color in COLORS"
        @click="selectColor(color)"
        :active="isColorActive(color)"
        :key="color"
      >
        <div :class="['rounded-full', 'p-[3px]']">
          <div
            :style="{ backgroundColor: color }"
            :class="['w-6', 'h-6', 'rounded-full']"
          ></div>
        </div>
      </GToolbarButton>
    </ToolbarButtonGroup>

    <GToolbarButtonDivider />

    <ToolbarButtonGroup>
      <GToolbarButton
        v-for="(weight, index) in BRUSH_WEIGHTS"
        @click="selectBrushWeight(weight)"
        :active="isBrushWeightActive(weight)"
        :key="weight"
      >
        <div
          :class="['bg-gray-400', 'rounded-md', 'w-[15px]']"
          :style="{ height: `${index * 5 + 1}px` }"
        ></div>
      </GToolbarButton>
    </ToolbarButtonGroup>

    <GToolbarButtonDivider />

    <ToolbarButtonGroup>
      <GToolbarButton
        @click="toggleErasing"
        :active="annotationErasing"
        icon="backspace_outline"
      />

      <GToolbarButton
        @click="clearAnnotations"
        icon="delete_outline"
      />
    </ToolbarButtonGroup>
  </GToolbar>
</template>
