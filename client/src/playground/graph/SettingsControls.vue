<script setup lang="ts">
  import type { Graph } from "@graph/types";
import InputCheckbox from "@playground/ui/InputCheckbox.vue";
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
    v-for="(setting, settingKey) in graph.settings.value"
    class="my-2 px-4"
  >
    <div class="text-white mb-2">
      <h3 class="font-bold text-lg">
        {{ camelCaseToTitleCase(settingKey) }}
      </h3>

      <h4 class="text-md">
        {{ setting }}
      </h4>
    </div>

    <InputColor
      v-if="
        typeof setting === 'string' && settingKey.toLowerCase().includes('color')
      "
      v-model="(graph.settings.value[settingKey] as string)"
      style="width: 100px; height: 30px"
    />

    <InputText
      v-else-if="typeof setting === 'string'"
      v-model="(graph.settings.value[settingKey] as string)"
    />

    <InputCheckbox
      v-else-if="typeof setting === 'boolean'"
      v-model="(graph.settings.value[settingKey] as boolean)"
      class="h-6 w-6 rounded-xl cursor-pointer"
    />

    <h5
      v-else
      class="text-red-500 font-bold"
    >
      Not Supported
    </h5>
  </div>
</template>
