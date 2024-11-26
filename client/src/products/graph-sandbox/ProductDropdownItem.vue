<script setup lang="ts">
  import { useProductRouting } from "@utils/product";
  import type { ProductInfoWithMenu } from "@utils/product";

  defineProps<{
    product: ProductInfoWithMenu;
  }>();

  const { navigate } = useProductRouting();
</script>

<template>
  <button
    @click="navigate(product)"
    class="hover:bg-gray-900 p-2 rounded-md cursor-pointer rounded-lg text-left flex gap-4"
  >
    <img
      :src="product.menu.thumbnail"
      class="object-cover h-20 w-20 rounded-md"
    />
    <div class="flex flex-col gap-1">
      <h1 class="text-xl font-bold text-gray-200">
        {{ product.menu.name }}
      </h1>
      <p class="text-md text-gray-400">
        {{ product.menu.description }}
      </p>
    </div>
  </button>
</template>
