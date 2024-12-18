<script setup lang="ts">
  import CToolbarHint from "@ui/core/toolbar/ToolbarHint.vue";
  import type { TutorialControls } from "@graph/tutorials/types";
  import { useNonNullGraphColors } from "@graph/themes/useGraphColors";

  const colors = useNonNullGraphColors();

  defineProps<{
    tutorial: TutorialControls;
  }>();
</script>

<template>
  <CToolbarHint
    :tutorial="tutorial"
    :color="colors.text + '75'"
  />
</template>
