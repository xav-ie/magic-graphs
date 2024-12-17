<script setup lang="ts">
  import GButton from "@ui/graph/button/GButton.vue";
  import type { GraphTemplate } from "../types";
  import { toRefs } from "vue";

  const props = defineProps<{
    template: GraphTemplate;
    loadTemplate: (id: string) => void;
    deleteTemplate: (id: string) => void;
  }>();

  const { template } = toRefs(props);
</script>

<template>
  <div class="flex flex-col">
    <p>{{ template.title }}</p>
    <p>{{ template.description }}</p>
    <img :src="template.thumbnail" class="aspect-video height-52 object-contain">
    <div class="flex gap-2 justify-center">
      <GButton @click="loadTemplate(template.id)">Load</GButton>
      <GButton @click="deleteTemplate(template.id)">Delete</GButton>
    </div>
  </div>
</template>
