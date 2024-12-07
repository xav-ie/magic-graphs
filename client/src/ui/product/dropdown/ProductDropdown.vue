<script setup lang="ts">
  import CPopover from "@ui/core/Popover.vue";
  import ProductDropdownMenu from "./ProductDropdownMenu.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import { useGraphColors } from "@graph/themes/useGraphColors";

  const colors = useGraphColors()
</script>

<template>
  <CPopover>
    <template #activator="{ toggle }">
      <GButton
        @click="toggle"
        class="px-4 py-2 text-xl rounded-lg"
      >
        <span :class="`text-${colors.brand}`">Magic Algorithms</span>
      </GButton>
    </template>

    <ProductDropdownMenu />
  </CPopover>
</template>
