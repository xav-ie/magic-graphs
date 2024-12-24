<script setup lang="ts">
  import { computed, ref } from "vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import { AVLTree, BinaryTree } from "./tree/avl";
  import { getRandomInRange } from "@utils/random";
  import { nonNullGraph as graph } from "@graph/global";
  import { useSimulationControls } from "@ui/product/sim/useSimulationControls";
  import { useTargetNodeColor } from "./theme/useTargetNodeColor";
  import type { InsertTrace } from "./tree/insert";

  const tree = new AVLTree();

  const key = ref(50);

  const rootPos = { x: 2300, y: 1500 };

  const { targetNode, activate } = useTargetNodeColor(graph.value);
  activate();

  const currTrace = ref<InsertTrace[]>([]);
  const trace = computed(() => currTrace.value);

  const sim = useSimulationControls(trace);

  sim.onStepChange((newStep) => {
    targetNode.value = undefined;

    const step = trace.value[newStep];
    if (step.action === 'insert') {
      tree.toGraph(graph.value, rootPos);
      return;
    }

    if (step.action === 'compare') {
      const { nodeId } = step;
      const node = graph.value.getNode(nodeId.toString());
      if (node) targetNode.value = node;
    }
  });

  const addNode = () => {
    sim.stop();

    currTrace.value = tree.insert(key.value);
    key.value = getRandomInRange(1, 100);

    // for adding the root node
    if (currTrace.value.length === 0) return tree.toGraph(graph.value, rootPos);
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
      Add Node ({{ key }})
    </GButton>
    <GButton
      @click="graph.reset"
      tertiary
    >
      Reset Graph
    </GButton>
  </GWell>
</template>
