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
  import SimulationPlaybackControls from "@ui/product/sim/SimulationPlaybackControls.vue";

  const tree = new AVLTree();

  const key = ref(getRandomInRange(1, 999));

  const rootPos = { x: 2300, y: 1500 };

  const { targetNode, activate } = useTargetNodeColor(graph.value);
  activate();

  const currTrace = ref<InsertTrace[]>([]);
  const trace = computed(() => currTrace.value);

  const sim = useSimulationControls(trace);

  sim.onStepChange((newStep) => {
    targetNode.value = undefined;

    const step = trace.value[newStep];
    treeArrayToGraph(graph.value, step.treeState, tree.root!, rootPos);

    if (step.action === "compare") {
      const { treeNodeKey } = step;
      const node = graph.value.getNode(treeNodeKey.toString());
      if (node) targetNode.value = node;
    }
  });

  const addNode = () => {
    sim.stop();

    currTrace.value = tree.insert(key.value);
    key.value = getRandomInRange(1, 999);

    sim.start();
  };
</script>

<template>
  <div class="flex flex-col gap-3">
    <SimulationPlaybackControls :controls="sim" />
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
      <GButton
        @click="sim.prevStep"
        tertiary
      >
        Back
      </GButton>
      <GButton
        @click="sim.nextStep"
        tertiary
      >
        Next
      </GButton>
      <!-- {{ sim.traceAtStep.value }} -->
    </GWell>
  </div>
</template>
