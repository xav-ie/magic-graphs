<script setup lang="ts">
  import type { TutorialControls } from "@graph/tutorials/types";
  import TutorialHint from "@graph/tutorials/TutorialHint.vue";

  defineProps<{
    tutorial: TutorialControls;
  }>();
</script>

<template>
  <TutorialHint
    :tutorial="tutorial"
    v-slot="{ hint }"
  >
    <h5 class="text-white text-opacity-60 text-sm">
      {{ hint }}
    </h5>
  </TutorialHint>
</template>
