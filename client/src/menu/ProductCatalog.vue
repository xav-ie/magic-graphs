<script setup lang="ts">
  import type { ProductInfo } from "src/types";
  import ProductItem from "./ProductItem.vue";

  defineProps<{
    products: Required<ProductInfo>[];
  }>();
</script>

<template>
  <div class="flex items-center justify-center gap-10">
    <div v-for="product in products">
      <router-link :to="product.route.path">
        <ProductItem :product="product" />
      </router-link>
    </div>
  </div>
</template>
