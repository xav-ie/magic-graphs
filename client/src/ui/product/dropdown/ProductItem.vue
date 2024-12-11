<script setup lang="ts">
  import { ref } from "vue";
  import { graph, queuedGraphStateLoadout } from "@graph/global";
  import { useProductRouting } from "@utils/product";
  import type { ProductInfoWithMenu } from "@utils/product";
  import GVerticalCardButton from "@ui/graph/button/GVerticalCardButton.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import type { ProductInfo } from "src/types";

  const { navigate } = useProductRouting();

  const navigateWithGraph = (product: ProductInfo) => {
    queuedGraphStateLoadout.value = {
      nodes: graph.value.nodes.value,
      edges: graph.value.edges.value,
    }
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
      <div class="flex items-center gap-3">
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
