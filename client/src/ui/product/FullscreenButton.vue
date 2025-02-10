<script setup lang="ts">
  import { onUnmounted } from "vue";
  import { useFullscreen } from "@vueuse/core";
  import { nonNullGraph as graph } from "@graph/global";
  import GButton from "@ui/graph/button/GButton.vue";
  import CIcon from "@ui/core/Icon.vue";

  const { toggle, isFullscreen } = useFullscreen();

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "f") {
      toggle();
    }
  };

  graph.value.subscribe("onKeyDown", handleKeydown);
  onUnmounted(() => graph.value.unsubscribe("onKeyDown", handleKeydown));
</script>

<template>
  <GButton @click="toggle" class="h-12 w-12">
    <CIcon
      class="text-3xl"
      :icon="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
    />
  </GButton>
</template>
