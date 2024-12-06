<script setup lang="ts">
  import { computed } from "vue";
  import CToolbar from "@ui/core/toolbar/ToolbarBase.vue";
  import GToolbarHint from "./GToolbarHint.vue";
  import { GToolbarBaseTheme } from "./GToolbarBaseTheme";
  import { graph } from "@graph/global";
  import type { TutorialControls } from "@graph/tutorials/types";

  const color = computed(() => GToolbarBaseTheme[graph.value.themeName.value]);

  defineProps<{
    hint?: TutorialControls;
  }>();
</script>

<template>
  <CToolbar
    :hint="hint"
    :color="color"
  >
    <slot></slot>
    <template #hint>
      <GToolbarHint
        v-if="hint"
        :tutorial="hint"
      />
    </template>
  </CToolbar>
</template>
