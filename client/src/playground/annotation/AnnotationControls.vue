<script setup lang="ts">
import Button from "@ui/Button.vue";
import colors from "@utils/colors";

const props = defineProps<{
  setColor: (color: string) => void,
  setBrushWeight: (brushWeight: number) => void,
  setEraser: () => void,
  clear: () => void,
  brushColors: string[];
  brushWeights: number[];
}>();
</script>

<template>
  <div
    class="absolute bottom-12 flex w-full justify-center items-center gap-6 z-10"
  >
    <Button
      v-for="color in brushColors"
      :key="color"
      @click="setColor(color)"
      :color="color"
      class="w-10 h-10"
      :style="{ backgroundColor: color, borderRadius: '50%' }"
    ></Button>
  </div>

  <div
    class="absolute bottom-3 flex w-full justify-center items-center gap-2 z-10"
  >
    <Button
      v-for="weight in brushWeights"
      :key="weight"
      @click="setBrushWeight(weight)"
      :color="colors.TRANSPARENT"
      class="h-[25px]"
    >
      <div
        class="flex justify-center items-center bg-gray-200 rounded-md w-[42px]"
        :style="{
          height: `${weight * 2}px`,
        }"
      ></div>
    </Button>
  </div>

  <div
    class="flex flex-column items-center absolute h-full z-10"
  >
    <Button
      @click="setEraser"
    >
    <v-icon>mdi-erasor</v-icon>
  </Button>
  </div>
</template>
