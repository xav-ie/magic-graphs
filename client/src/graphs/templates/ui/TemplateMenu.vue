<script setup lang="ts">
  import { graph } from "@graph/global";
  import CPopover from "@ui/core/Popover.vue";
  import GWell from "@ui/graph/GWell.vue";
  import { useTemplate } from "../useTemplate";
  import GButton from "@ui/graph/button/GButton.vue";

  const { templates, addCurrentGraphAsTemplate, loadTemplate, clearUserTemplates, deleteUserTemplate } = useTemplate(graph.value);
</script>

<template>
  <CPopover>
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>
    <GWell class="flex flex-col text-xl font-bold p-3 w-[400px] max-h-[600px] overflow-auto rounded-lg gap-2"> 
      
      <div v-for="template in templates" class="flex gap-2">
        <GButton @click="loadTemplate(template.id)">Load</GButton>
        <GButton @click="deleteUserTemplate(template.id)">Delete</GButton>
      </div>

      <GButton @click="addCurrentGraphAsTemplate">Save</GButton>
      <GButton @click="clearUserTemplates">Clear</GButton>
    </GWell>
   
  </CPopover>
</template>
