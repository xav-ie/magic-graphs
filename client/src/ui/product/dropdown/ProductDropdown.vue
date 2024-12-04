<script setup lang="ts">
  import CPopover from "@ui/core/Popover.vue";
  import ProductDropdownMenu from "./ProductDropdownMenu.vue";
</script>

<template>
  <CPopover>
    <template #activator="{ toggle }">
      <button
        @click="toggle"
        class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 text-xl font-bold rounded-lg"
      >
        <h1
          class="bg-gradient-to-tr dark:from-purple-600 dark:to-orange-500 from-purple-500 to-orange-500 text-transparent bg-clip-text"
        >
          Magic Algorithms
        </h1>
      </button>
    </template>

    <ProductDropdownMenu />
  </CPopover>
</template>
