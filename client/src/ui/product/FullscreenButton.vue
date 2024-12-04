<script setup lang="ts">
  import { onUnmounted } from "vue";
  import { useFullscreen } from "@vueuse/core";
  import { graph } from "@graph/global";
  import colors from "@utils/colors";
  import Button from "@ui/Button.vue";
  import CIcon from "@ui/core/Icon.vue";

  const { toggle } = useFullscreen();

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "f") {
      toggle();
    }
  };

  graph.value.subscribe("onKeyDown", handleKeydown);
  onUnmounted(() => graph.value.unsubscribe("onKeyDown", handleKeydown));
</script>

<template>
  <Button
    @click="toggle"
    :color="colors.GRAY_800"
    :text-color="colors.WHITE"
    class="aspect-square"
  >
    <CIcon icon="fullscreen" />
  </Button>
</template>
