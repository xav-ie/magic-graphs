<script setup lang="ts">
  import GButton from "@ui/graph/button/GButton.vue";
  import CPopoverTooltip from "@ui/core/PopoverTooltip.vue";
  import GWell from "@ui/graph/GWell.vue";
  import CIcon from "@ui/core/Icon.vue";

  defineProps<{
    tooltip: string;
  }>();
</script>

<template>
  <CPopoverTooltip>
    <GButton
      v-bind="$attrs"
      tertiary
      class="px-2 py-1 flex items-center gap-1 rounded-lg"
    >
      <slot></slot>
      <CIcon icon="info_outline" />
    </GButton>
    <template #content>
      <GWell
        tertiary
        class="px-3 py-2 w-72 rounded-lg"
      >
        <div v-html="tooltip"></div>
      </GWell>
    </template>
  </CPopoverTooltip>
</template>
