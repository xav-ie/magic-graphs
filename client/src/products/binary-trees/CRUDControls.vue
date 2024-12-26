<script setup lang="ts">
  import { computed, ref } from "vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import { AVLTree } from "./tree/avl";
  import type { InsertTrace } from "./tree/avl";
  import { getRandomInRange } from "@utils/random";
  import { nonNullGraph as graph } from "@graph/global";
  import { useSimulationControls } from "@ui/product/sim/useSimulationControls";
  import { useTargetNodeColor } from "./theme/useTargetNodeColor";
  import { treeArrayToGraph } from "./tree/treeArrayToGraph";

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
    if (step.action === "insert" || step.action === "balance") {
      treeArrayToGraph(graph.value, step.treeState, tree.root!, rootPos);
      return;
    }

    if (step.action === "compare") {
      const { treeNodeKey } = step;
      const node = graph.value.getNode(treeNodeKey.toString());
      if (node) targetNode.value = node;
    }
  });

  const addNode = () => {
    sim.stop();

    currTrace.value = tree.insert(key.value);
    console.log(JSON.stringify(currTrace.value, null, 2));
    key.value++;

    // for adding the root node
    if (currTrace.value.length === 0) {
      graph.value.addNode(
        {
          id: key.value.toString(),
          label: key.value.toString(),
          ...rootPos,
        },
        { animate: true }
      );
      return;
    }
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
