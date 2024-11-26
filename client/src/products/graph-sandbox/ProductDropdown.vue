<script setup lang="ts">
  import type { ProductInfo } from "src/types";
  import { products } from "@utils/product";
  import { useRoute, useRouter } from "vue-router";
  import { collabControls } from "@graph/collab";

  type ProductInfoWithMenu = ProductInfo & Required<Pick<ProductInfo, "menu">>;

  const productsWithMenuConfigured = products.filter(
    (info) => info?.menu
  ) as ProductInfoWithMenu[];

  const router = useRouter();
  const route = useRoute();

  const productLink = (productRoute: string) => {
    console.log("productRoute", productRoute);
    const roomId = route.query.rid;
    const roomIdValid = typeof roomId === "string" && roomId.length > 0;
    return roomIdValid ? `${productRoute}?rid=${roomId}` : productRoute;
  };

  const navigate = (product: ProductInfoWithMenu) => {
    const redirectLink = product.route?.redirect?.toString();
    const goingExternal = redirectLink?.startsWith("http");

    if (redirectLink && goingExternal) {
      return window.open(redirectLink, "_blank");
    }

    router.push(productLink(product.route.path));
  };
</script>

<template>
  <v-menu :offset="[10, 0]">
    <template v-slot:activator="{ props }">
      <button
        v-bind="props"
        class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 text-xl font-bold rounded-lg"
      >
        <h1
          class="bg-gradient-to-tr dark:from-purple-600 dark:to-orange-500 from-purple-500 to-orange-500 text-transparent bg-clip-text"
        >
          Magic Algorithms
        </h1>
      </button>
    </template>

    <div
      class="bg-gray-800 flex flex-col text-white p-2 w-[400px] h-[700px] overflow-auto rounded-lg"
    >
      <button
        v-for="product in productsWithMenuConfigured"
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
    </div>
  </v-menu>
</template>
