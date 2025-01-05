<script setup lang="ts">
  import { ref } from "vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import type { TreeControls } from "../useTree";

  const props = defineProps<{
    tree: TreeControls;
  }>();
</script>

<template>
  <div class="flex flex-col gap-3">
    <GWell
      secondary
      class="rounded-lg flex gap-2 p-2"
    >
      <GButton
        @click="tree.balanceTree"
        :disabled="props.tree.isBalanced.value"
        tertiary
      >
        Balance Tree
      </GButton>
    </GWell>
  </div>
</template>
