<script setup lang="ts">
  import GButton from "@ui/graph/button/GButton.vue";
  import CPopoverTooltip from "@ui/core/PopoverTooltip.vue";
  import GWell from "@ui/graph/GWell.vue";

  defineProps<{
    tooltip: string;
  }>();
</script>

<template>
  <CPopoverTooltip>
    <GButton
      tertiary
      class="px-2 py-1 rounded-lg"
    >
      <slot></slot>
    </GButton>
    <template #content>
      <GWell
        tertiary
        class="p-2 w-72 rounded-lg"
      >
        <div v-html="tooltip"></div>
      </GWell>
    </template>
  </CPopoverTooltip>
</template>
