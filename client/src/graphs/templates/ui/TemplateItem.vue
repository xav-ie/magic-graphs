<script setup lang="ts">
import GButton from "@ui/graph/button/GButton.vue";
import type { GraphTemplate } from "../types";
import { ref, toRefs } from "vue";
import colors from "@utils/colors";

const props = defineProps<{
  template: GraphTemplate;
  loadTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
}>();

const { template } = toRefs(props);

const hovered = ref(false);
</script>

<template>
  <div
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    class="relative flex flex-col"
  >
    <p>{{ template.title }}</p>
    <p>{{ template.description }}</p>
    <img
      :src="template.thumbnail"
      class="aspect-video height-52 object-contain p-2 transition duration-200"
      :style="{
        opacity: hovered ? 0.5 : 1,
      }"
    />
    <div
      class="absolute w-full h-full z-10 flex items-center justify-center transition duration-200"
      :style="{
        opacity: hovered ? 1 : 0,
      }"
    >
      <div class="flex gap-2">
        <GButton @click="loadTemplate(template.id)">Load</GButton>
        <GButton @click="deleteTemplate(template.id)" :color="colors.RED_500"
          >Delete</GButton
        >
      </div>
    </div>
  </div>
</template>
