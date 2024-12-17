<script setup lang="ts">
  import GButton from "@ui/graph/button/GButton.vue";
  import { useTemplate } from "../useTemplate";
  import { graph } from "@graph/global";

  const { addCurrentGraphAsTemplate, loadTemplate, clearTemplates} = useTemplate(graph.value);
</script>

<template>
  <GButton @click="addCurrentGraphAsTemplate({title: 'generated from button', description: ':DDDDD'})">GenerateTemplate</GButton>
  <GButton @click="loadTemplate('10')">Load</GButton>
  <GButton @click="clearTemplates">Clear</GButton>
</template>