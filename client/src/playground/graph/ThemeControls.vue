<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import InputColor from "@playground/ui/InputColor.vue";
  import InputRange from "@playground/ui/InputRange.vue";
  import InputText from "@playground/ui/InputText.vue";
  import { camelCaseToTitleCase } from "@utils/string";

  defineProps<{
    graph: Graph;
  }>();
</script>

<template>
  <div
    v-for="(theme, themeKey) in graph.theme.value"
    class="my-2 px-4"
  >
    <div class="text-white mb-2">
      <h3 class="font-bold text-lg">
        {{ camelCaseToTitleCase(themeKey) }}
      </h3>

      <h4 class="text-md">
        {{ theme }}
      </h4>
    </div>

    <InputColor
      v-if="
        typeof theme === 'string' && themeKey.toLowerCase().includes('color')
      "
      v-model="(graph.theme.value[themeKey] as string)"
      style="width: 100px; height: 30px"
    />

    <InputText
      v-else-if="typeof theme === 'string'"
      v-model="(graph.theme.value[themeKey] as string)"
    />

    <InputRange
      v-else-if="typeof theme === 'number'"
      v-model="(graph.theme.value[themeKey] as number)"
      style="width: 100%"
      :min="0"
      :max="100"
    />

    <h5
      v-else
      class="text-red-500"
    >
      Not Supported
    </h5>
  </div>
</template>
