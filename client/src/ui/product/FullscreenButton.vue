<script setup lang="ts">
  import { onUnmounted } from "vue";
  import { useFullscreen } from "@vueuse/core";
  import { graph } from "@graph/global";
  import colors from "@utils/colors";
  import CButton from "@ui/core/Button.vue";
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
  <CButton
    @click="toggle"
    :color="colors.GRAY_800"
    class="aspect-square"
  >
    <CIcon icon="fullscreen" />
  </CButton>
</template>
