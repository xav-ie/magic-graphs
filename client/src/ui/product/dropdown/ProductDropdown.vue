<script setup lang="ts">
  import ProductDropdownButton from "./ProductDropdownButton.vue";
  import ProductDropdownMenu from "./ProductDropdownMenu.vue";
</script>

<template>
  <v-menu :offset="[10, 0]">
    <template #activator="{ props }">
      <ProductDropdownButton v-bind="props" />
    </template>

    <ProductDropdownMenu />
  </v-menu>
</template>
