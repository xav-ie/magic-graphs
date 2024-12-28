<script setup lang="ts">
  import { nonNullGraph as graph } from "@graph/global";
  import GHoverInfoTop from "@ui/graph/GHoverInfoTop.vue";
  import GWell from "@ui/graph/GWell.vue";
  import type { TreeControls } from "../useTree";
  import { computed } from "vue";
  import { useBalanceFactorLabels } from "./useBalanceFactorLabels";

  const props = defineProps<{
    tree: TreeControls;
  }>();

  const {
    label: labelBalance,
    unlabel: unlabelBalance,
  } = useBalanceFactorLabels(graph.value, props.tree);

  const definitions = {
    balanceFactor:
      "The balance factor of a node is the height of its right subtree minus the height of its left subtree.",
  };

  const rootBalance = () => {
    const { tree } = props.tree;
    return tree.root ? tree.getBalance(tree.root) : undefined;
  };
</script>

<template>
  <GWell
    secondary
    class="p-2 rounded-lg flex flex-wrap gap-2"
  >
    <GHoverInfoTop
      @mouseenter="labelBalance"
      @mouseleave="unlabelBalance"
      :tooltip="definitions.balanceFactor"
    >
      Balance Factor? {{ rootBalance() }}
    </GHoverInfoTop>
  </GWell>
</template>
