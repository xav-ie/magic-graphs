<script setup lang="ts">
  import { COLORS, BRUSH_WEIGHTS } from "@graph/plugins/annotations/constants";
  import { nonNullGraph as graph } from "@graph/global";
  import type { Color } from "@utils/colors";
  import GToolbar from "@ui/graph/toolbar/GToolbarBase.vue";
  import GToolbarButton from "@ui/graph/toolbar/GToolbarButton.vue";
  import GToolbarButtonDivider from "@ui/graph/toolbar/GToolbarDivider.vue";
  import ToolbarButtonGroup from "@ui/core/toolbar/ToolbarButtonGroup.vue";

  const {
    clear,
    brushWeight,
    erasing,
    color,
  } = graph.value.annotation;

  const selectColor = (newColor: Color) => {
    color.value = newColor;
    erasing.value = false;
  };

  const selectBrushWeight = (newBrushWeight: number) => {
    brushWeight.value = newBrushWeight;
  };

  const isColorActive = (newColor: Color) => {
    if (erasing.value) return false;
    return color.value === newColor;
  };

  const isBrushWeightActive = (newBrushWeight: number) => {
    return brushWeight.value === newBrushWeight;
  };

  const toggleErasing = () => {
    erasing.value = !erasing.value;
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
        :active="erasing"
        icon="backspace_outline"
      />

      <GToolbarButton
        @click="clear"
        icon="delete_outline"
      />
    </ToolbarButtonGroup>
  </GToolbar>
</template>
