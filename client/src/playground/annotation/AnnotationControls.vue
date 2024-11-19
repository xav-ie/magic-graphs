<script setup lang="ts">
  import Button from "@ui/Button.vue";
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
  }>();
</script>

<template>
  <Toolbar>
    <ToolbarButtonGroup
      v-for="color in brushColors"
      :key="color"
    >
      <ToolbarButton
        @click="setColor(color)"
        :color="color"
        :style="{ backgroundColor: color, borderRadius: '50%' }"
        class="w-8 h-8"
      ></ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonDivider />

    <ToolbarButtonGroup>
      <Button
        v-for="weight in brushWeights"
        :key="weight"
        @click="setBrushWeight(weight)"
        :color="colors.TRANSPARENT"
        class="h-[25px]"
      >
        <div
          class="flex justify-center items-center bg-gray-300 rounded-md w-[15px]"
          :style="{
            height: `${weight * 2}px`,
          }"
        ></div>
      </Button>
    </ToolbarButtonGroup>

    <ToolbarButtonDivider />

    <ToolbarButtonGroup>
      <ToolbarButton @click="setEraser">mdi-eraser</ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonDivider />

    <ToolbarButtonGroup>
      <ToolbarButton @click="clear">mdi-delete-outline</ToolbarButton>
    </ToolbarButtonGroup>
  </Toolbar>
</template>
