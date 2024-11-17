<script setup lang="ts">
import Button from "@ui/Button.vue";
import colors from "@utils/colors";

const props = defineProps<{
  setColor: (color: string) => void;
  setBrushWeight: (brushWeight: number) => void;
  setEraser: () => void;
  clear: () => void;
  brushColors: string[];
  brushWeights: number[];
}>();
</script>

<template>
  <div
    class="absolute bottom-12 flex w-full justify-center z-10"
  >
    <div class="bg-gray-900 px-3 py-2 rounded-xl flex items-center gap-3">
      <Button
        v-for="color in brushColors"
        :key="color"
        @click="setColor(color)"
        :color="color"
        class="w-8 h-8"
        :style="{ backgroundColor: color, borderRadius: '50%' }"
      ></Button>
      <div class="w-[1px] h-8 bg-gray-600"></div>
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
      <div class="w-[1px] h-8 bg-gray-600"></div>

      <btn @click="setEraser" class="text-white">
        <v-icon>mdi-eraser </v-icon>
      </btn>
      <div class="w-[1px] h-8 bg-gray-600"></div>

      <btn @click="clear" class="text-white">
        <v-icon>mdi-nuke</v-icon>
      </btn>
    </div>
  </div>
</template>
