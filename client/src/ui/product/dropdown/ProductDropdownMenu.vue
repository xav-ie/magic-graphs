<script setup lang="ts">
  import { products } from "@utils/product";
  import type { ProductInfoWithMenu } from "@utils/product";
  import ProductDropdownItem from "./ProductDropdownItem.vue";

  const productsWithMenu = products.filter(
    (info) => info?.menu
  ) as ProductInfoWithMenu[];
</script>

<template>
  <div
    class="bg-gray-800 flex flex-col text-white p-2 w-[400px] h-[700px] overflow-auto rounded-lg"
  >
    <ProductDropdownItem
      v-for="product in productsWithMenu"
      :key="product.productId"
      :product="product"
    />
  </div>
</template>
