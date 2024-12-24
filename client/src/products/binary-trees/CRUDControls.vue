<script setup lang="ts">
  import { computed, ref } from "vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import { AVLTree, BinaryTree } from "./tree/avl";
  import { getRandomInRange } from "@utils/random";
  import { nonNullGraph as graph } from "@graph/global";
  import { useSimulationControls } from "@ui/product/sim/useSimulationControls";
  import { useTargetNodeColor } from "./theme/useTargetNodeColor";

  const tree = new AVLTree();

  const rootPos = { x: 2300, y: 1500 };

  const { targetNode, activate } = useTargetNodeColor(graph.value);
  activate()

  const currTrace = ref<number[]>([]);
  const trace = computed(() => currTrace.value);

  const sim = useSimulationControls(trace, {
    lastStep: computed(() => trace.value.length),
  });

  sim.onStepChange((step) => {
    const treeNodeKey = trace.value[step];
    if (treeNodeKey === undefined) {
      targetNode.value = undefined;
      tree.toGraph(graph.value, rootPos);
      return;
    }
    const node = graph.value.getNode(treeNodeKey.toString());
    if (node) targetNode.value = node;
  });

  const addNode = () => {
    sim.stop();

    const key = getRandomInRange(1, 100);
    currTrace.value = tree.insert(key);

    sim.start();
  };
</script>

<template>
  <GWell
    secondary
    class="rounded-lg flex gap-2 p-2"
  >
    <GButton
      @click="addNode"
      tertiary
    >
      Add Node
    </GButton>
    <GButton
      @click="graph.reset"
      tertiary
    >
      Reset Graph
    </GButton>
  </GWell>
</template>
