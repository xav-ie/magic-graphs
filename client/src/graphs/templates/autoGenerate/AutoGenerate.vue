<script setup lang="ts">
import GButton from "@ui/graph/button/GButton.vue";
import CIcon from "@ui/core/Icon.vue";
import { useAutoGenerate } from "./useAutoGenerate";
import { nonNullGraph as graph } from "@graph/global";

const { generate } = useAutoGenerate(graph.value);
</script>

<template>
  <GButton @click="generate">
    <CIcon icon="add"></CIcon>
    Generate New
  </GButton>
</template>