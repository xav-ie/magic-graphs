<script setup lang="ts">
  import type { ProductInfo } from "src/types";
  import { ref } from "vue";

  const infoModules = import.meta.glob<{
    default: ProductInfo;
  }>("/src/**/info.ts", { eager: true });

  const productInfos = Object.values(infoModules).map((m) => m.default);

  const mainMenuData = ref(
    productInfos.filter((info) => info?.menu) as Required<ProductInfo>[]
  );
</script>

<template>
  <div class="w-full h-full relative flex items-center justify-center flex-col bg-gradient-to-tl to-purple-100 from-white ">
    <div class="mb-10 text-center">
      <h1
        class="font-black text-7xl bg-gradient-to-tr from-purple-500 to-orange-500 text-transparent bg-clip-text p-4"
      >
        Magic Products
      </h1>
      <h3 class="font-bold text-2xl">
        Select An Experience To Begin
      </h3>
    </div>
    <div class="flex items-center justify-center gap-10">
      <div v-for="product in mainMenuData">
        <router-link :to="product.route.path">
          <div>
            <img
              :src="product.menu.thumbnail"
              :alt="product.menu.name"
              class="w-60 h-60 object-cover rounded-lg"
            />
            <h2 class="text-center font-bold text-2xl mt-4">
              {{ product.name }}
            </h2>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
