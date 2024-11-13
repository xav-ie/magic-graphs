<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import InputColor from "@ui/InputColor.vue";
  import InputRange from "@ui/InputRange.vue";
  import InputText from "@ui/InputText.vue";
  import { camelCaseToTitleCase } from "@utils/string";
  import { THEMES } from "@graph/themes";
  import Button from "@ui/Button.vue";

  defineProps<{
    graph: Graph;
  }>();
</script>

<template>
  <div class="px-4 my-2">
    <div>
      <h2 class="text-2xl font-bold text-white">Theme Controls</h2>
    </div>
    <div class="my-2">
      <div>
        <h1 class="text-xl font-bold text-white">Theme Presets</h1>
      </div>
      <div
        v-for="(value, key) in THEMES"
        @click="graph.theme.value = value"
        class="my-2"
      >
        <Button style="width: 100%">
          {{ camelCaseToTitleCase(key) }}
        </Button>
      </div>
    </div>
    <div
      v-for="(theme, themeKey) in graph.theme.value"
      class="my-2"
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
        class="text-red-500 font-bold"
      >
        Not Supported
      </h5>
    </div>
  </div>
</template>
