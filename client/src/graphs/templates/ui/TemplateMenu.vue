<script setup lang="ts">
  import { graph } from "@graph/global";
  import CPopover from "@ui/core/Popover.vue";
  import GWell from "@ui/graph/GWell.vue";
  import { useTemplate } from "../useTemplate";
  import GButton from "@ui/graph/button/GButton.vue";
  import TemplateItem from "./TemplateItem.vue";
import { computed } from "vue";

  const {
    templates,
    userTemplates,
    addCurrentGraphAsTemplate,
    loadTemplate,
    clearUserTemplates,
    deleteUserTemplate,
  } = useTemplate(graph.value);

  const color = computed(() => graph.value.baseTheme.value.graphBgColor);
</script>

<template>
  <CPopover>
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>
    <GWell
      class="flex flex-col text-xl font-bold p-3 w-[400px] rounded-lg gap-2"
    >
      <p
        v-if="templates.length === 0"
        class="font-normal text-base text-center"
      >
        Add a template!
      </p>
      <div v-else class="max-h-[600px] overflow-auto">
        <div
          v-for="template in templates"
          :key="template.id"
          class="flex flex-col gap-2 mb-2"
        >
          <TemplateItem
            :template="template"
            :loadTemplate="loadTemplate"
            :deleteTemplate="deleteUserTemplate"
            class="w-full rounded"
            :style="{
              backgroundColor: color,
            }"
          />
        </div>
      </div>

      <hr class="my-2" />

      <div class="flex gap-2 justify-center">
        <GButton @click="addCurrentGraphAsTemplate" :disabled="graph.nodes.value.length === 0">Save Current</GButton>
        <GButton @click="clearUserTemplates" :disabled="userTemplates.length === 0">Clear All</GButton>
      </div>
    </GWell>
  </CPopover>
</template>
