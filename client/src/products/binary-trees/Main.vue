<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import GraphProduct from "@ui/product/GraphProduct.vue";
  import { BINARY_TREE_GRAPH_SETTINGS } from "./settings";
  import CRUDControls from "./ui/CRUDControls.vue";
  import TreeInfoLabels from "./ui/TreeInfoLabels.vue";
  import { useTree } from "./useTree";
  import AddNodePanel from "./ui/AddNodePanel.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, BINARY_TREE_GRAPH_SETTINGS);

  const tree = useTree(graph);

  graph.settings.value.shortcutDelete = () => {
    const { focusedNodes } = graph.focus;
    if (focusedNodes.value.length !== 1) return
    tree.removeNode(Number(focusedNodes.value[0].label));
  };

  graph.settings.value.shortcutUndo = () => {
    tree.undo();
  }

  graph.settings.value.shortcutRedo = () => tree.redo();
</script>

<template>
  <GraphProduct
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  >
    <template #top-center>
      <CRUDControls :tree="tree" />
    </template>

    <template #center-left>
      <AddNodePanel :tree="tree" />
    </template>

    <template #bottom-center>
      <TreeInfoLabels :tree="tree" />
    </template>
  </GraphProduct>
</template>
