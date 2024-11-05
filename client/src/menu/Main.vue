<script setup lang="ts">
import type { ProductInfo } from 'src/types'
import { ref } from 'vue';

const infoModules = import.meta.glob<{
  default: ProductInfo
}>('/src/**/info.ts', { eager: true })

const productInfos = Object.values(infoModules).map((m) => m.default)

const mainMenuData = ref(productInfos.filter((info) => info?.menu) as Required<ProductInfo>[])
</script>

<template>
  <div class="w-[100vw] h-[100vh] relative">
    Main Menu {{ mainMenuData }}
  </div>

  <div v-for="product in mainMenuData">
    {{ product.name }}
    <!-- <router-link
      :to="product.route.path"
    >
      {{ product.name }}
    </router-link> -->
  </div>
</template>