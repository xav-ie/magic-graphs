<script setup lang="ts">
import GWell from '@ui/graph/GWell.vue';
import GButton from '@ui/graph/button/GButton.vue';
import type { TreeControls } from '../useTree';
import { ref } from 'vue';

const props = defineProps<{
  tree: TreeControls;
}>();

const recommendedNodes = ref([1, 2, 3, 4, 5])
</script>

<template>
  <GWell class="p-2 rounded-xl">
    <div class="flex gap-2 flex-col">
      <GButton v-for="node in recommendedNodes" :key="node" @click="props.tree.insertNode(node)" secondary
        class="rounded-full w-10 h-10">
        {{ node }}
      </GButton>
    </div>
  </GWell>
</template>