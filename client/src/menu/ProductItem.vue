<script setup lang="ts">
import type { ProductInfo } from "src/types";

defineProps<{
  product: Required<ProductInfo>;
}>();
</script>

<template>
  <div>
    <img
      :src="product.menu.thumbnail"
      :alt="product.menu.name"
      class="w-60 h-60 object-cover rounded-2xl"
    />
    <h2 class="text-center font-bold text-2xl mt-4 text-gray-800">
      {{ product.name }}
    </h2>
  </div>
</template>
