<script setup lang="ts">
  import { computed } from "vue";
  import CToolbarHint from "@ui/core/toolbar/ToolbarHint.vue";
  import { GToolbarHintTheme } from "./GToolbarHintTheme";
  import { graph } from "@graph/global";
  import type { TutorialControls } from "@graph/tutorials/types";

  const color = computed(() => GToolbarHintTheme[graph.value.themeName.value]);

  defineProps<{
    tutorial: TutorialControls;
  }>();
</script>

<template>
  <CToolbarHint
    :tutorial="tutorial"
    :color="color"
  />
</template>
