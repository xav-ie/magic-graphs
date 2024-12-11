<script setup lang="ts">
  import { ref } from "vue";
  import { graph, queuedGraphStateLoadout } from "@graph/global";
  import { useProductRouting, getCurrentProduct } from "@utils/product";
  import type { ProductInfoWithMenu } from "@utils/product";
  import GVerticalCardButton from "@ui/graph/button/GVerticalCardButton.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import type { ProductInfo } from "src/types";
  import CIcon from "@ui/core/Icon.vue";
import GWell from "@ui/graph/GWell.vue";

  const { navigate } = useProductRouting();
  const currentProduct = getCurrentProduct();

  const navigateWithGraph = (product: ProductInfo) => {
    queuedGraphStateLoadout.value = {
      nodes: graph.value.nodes.value,
      edges: graph.value.edges.value,
    };
    navigate(product);
  };

  defineProps<{
    product: ProductInfoWithMenu;
  }>();

  const hovered = ref(false);
</script>

<template>
  <div
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    class="relative"
  >
    <div
      class="absolute w-full h-full z-10 grid place-items-center transition duration-200"
      :style="{
        opacity: hovered ? 1 : 0,
      }"
    >
      <div
        v-if="currentProduct.productId !== product.productId"
        class="flex items-center gap-3"
      >
        <GButton
          @click="navigate(product)"
          tertiary
          class="grid place-items-center w-[120px] text-sm"
        >
          <!-- TODO move these images over to CIcons asap so they integrate with all graph themes -->
          <img
            src="/icons/arrow_right_alt.svg"
            class="w-8 h-8"
            alt="go to product"
          />
          go
        </GButton>
        <GButton
          @click="navigateWithGraph(product)"
          tertiary
          class="grid place-items-center w-[120px] text-sm"
        >
          <img
            src="/icons/step_over.svg"
            class="w-8 h-8"
            alt="go to product with graph"
          />
          go with graph
        </GButton>
      </div>
      <GWell
        v-else
        tertiary
        class="flex items-center gap-2 p-1 rounded-md text-xl font-bold overflow-hidden"
      >
        <CIcon
          icon="star"
          class="text-[50px] text-yellow-500 animate-bounce"
        />
        you are here!
        <CIcon
          icon="star"
          class="text-[50px] text-yellow-500 animate-bounce"
        />
      </GWell>
    </div>
    <GVerticalCardButton
      :image-src="product.menu.thumbnail"
      :title="product.menu.name"
      :description="product.menu.description"
      class="rounded-md"
      :style="{
        opacity: hovered ? 0.5 : 1,
      }"
    />
  </div>
</template>
