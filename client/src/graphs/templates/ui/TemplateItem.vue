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
  <p>{{ template.title }}</p>
  <p>{{ template.description }}</p>
  <img :src="template.thumbnail">
  <GButton @click="loadTemplate(template.id)">Load</GButton>
  <GButton @click="deleteTemplate(template.id)">Delete</GButton>
</template>
