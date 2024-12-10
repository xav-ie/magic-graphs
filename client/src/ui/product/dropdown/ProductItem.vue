<script setup lang="ts">
  import { useProductRouting } from "@utils/product";
  import type { ProductInfoWithMenu } from "@utils/product";
  import GVerticalCardButton from "@ui/graph/button/GVerticalCardButton.vue";

  const { navigate } = useProductRouting();

  const props = defineProps<{
    product: ProductInfoWithMenu;
  }>();
</script>

<template>
  <GVerticalCardButton
    @click="navigate(product)"
    :key="product.productId"
    :image-src="product.menu.thumbnail"
    :title="product.menu.name"
    :description="product.menu.description"
    class="rounded-md"
  />
</template>
