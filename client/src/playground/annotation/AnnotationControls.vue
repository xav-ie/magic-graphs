<script setup lang="ts">
  import colors from "@utils/colors";
  import Toolbar from "@product/graph-sandbox/Toolbar.vue";
  import ToolbarButton from "@product/graph-sandbox/ToolbarButton.vue";
  import ToolbarButtonDivider from "@product/graph-sandbox/ToolbarButtonDivider.vue";
  import ToolbarButtonGroup from "@product/graph-sandbox/ToolbarButtonGroup.vue";

  defineProps<{
    setColor: (color: string) => void;
    setBrushWeight: (brushWeight: number) => void;
    setEraser: () => void;
    clear: () => void;
    brushColors: string[];
    brushWeights: number[];
    selectedColor: string;
    selectedBrushWeight: number;
  }>();
</script>

<template>
  <Toolbar>
    <ToolbarButtonGroup>
      <ToolbarButton
        v-for="color in brushColors"
        @click="setColor(color)"
        :active="selectedColor === color"
        :key="color"
        :color="color"
      >
        <div
          :class="[
            'rounded-full',
            'p-[3px]',
            // selectedColor === color && 'border border-white',
          ]"
        >
          <div :class="['w-6', 'h-6', 'rounded-full', `bg-[${color}]`]"></div>
        </div>
      </ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonDivider />

    <ToolbarButtonGroup>
      <ToolbarButton
        v-for="weight in brushWeights"
        @click="setBrushWeight(weight)"
        :active="selectedBrushWeight === weight"
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
      <ToolbarButton
        @click="setEraser"
        :active="!selectedColor"
      >
        mdi-eraser
      </ToolbarButton>

      <ToolbarButton @click="clear">mdi-delete-outline</ToolbarButton>
    </ToolbarButtonGroup>
  </Toolbar>
</template>
