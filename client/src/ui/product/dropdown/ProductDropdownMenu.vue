<script setup lang="ts">
  import { products, useProductRouting } from "@utils/product";
  import type { ProductInfoWithMenu } from "@utils/product";
  import GWell from "@ui/graph/GWell.vue";
  import GVerticalCardButton from "@ui/graph/button/GVerticalCardButton.vue";

  const { navigate } = useProductRouting();

  const productsWithMenu = products.filter(
    (info) => info?.menu
  ) as ProductInfoWithMenu[];
</script>

<template>
  <GWell class="flex flex-col p-2 w-[400px] h-[700px] overflow-auto rounded-lg">
    <GVerticalCardButton
      v-for="product in productsWithMenu"
      @click="navigate(product)"
      :key="product.productId"
      :image-src="product.menu.thumbnail"
      :title="product.menu.name"
      :description="product.menu.description"
    />
  </GWell>
</template>
