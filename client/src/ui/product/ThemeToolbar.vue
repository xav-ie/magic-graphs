<script setup lang="ts">
  import type { PreferredGraphTheme } from "@graph/themes/usePreferredTheme";
  import GToolbar from "@ui/graph/toolbar/GToolbarBase.vue";
  import GToolbarButton from "@ui/graph/toolbar/GToolbarButton.vue";
  import { nonNullGraph as graph } from "@graph/global";
  import ToolbarButtonGroup from "@ui/core/toolbar/ToolbarButtonGroup.vue";

  const themeNameToIcon: Record<PreferredGraphTheme, string> = {
    auto: "settings_outline",
    light: "light_mode_outline",
    dark: "dark_mode_outline",
    girl: "girl",
  };
</script>

<template>
  <GToolbar>
    <ToolbarButtonGroup>
      <GToolbarButton
        v-for="(val, key) in themeNameToIcon"
        :key="key"
        @click="graph.preferredTheme.value = key"
        :icon="val"
        :active="key === graph.preferredTheme.value"
      />
    </ToolbarButtonGroup>
  </GToolbar>
</template>
