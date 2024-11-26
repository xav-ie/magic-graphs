<script setup lang="ts">
  import { ref } from "vue";
  import type { Graph } from "@graph/types";
  import Button from "@ui/Button.vue";
  import { usePrim } from "./usePrim";
  import { MST_ALGORITHMS } from "./useSimulation";
  import type { MSTAlgorithm, MSTSimulationControls } from "./useSimulation";
  import { useMSTColorizer } from "./useMSTColorizer";
  import colors from "@utils/colors";

  const props = defineProps<{
    graph: Graph;
    simControls: MSTSimulationControls;
    startSimulation: (algorithm: MSTAlgorithm) => void;
  }>();

  const mst = usePrim(props.graph);
  const { colorize, decolorize } = useMSTColorizer(props.graph, mst);

  const mstShowing = ref(false);

  const showMST = () => {
    mstShowing.value = true;
    colorize();
  };

  const hideMST = () => {
    mstShowing.value = false;
    decolorize();
  };

  const SHOW_MST_SHORTCUT = "s";

  props.graph.subscribe("onKeyDown", (e: KeyboardEvent) => {
    if (e.key.toLowerCase() !== SHOW_MST_SHORTCUT) return;
    mstShowing.value ? hideMST() : showMST();
  });
</script>

<template>
  <Button
    v-if="!mstShowing"
    @click="showMST"
    :color="colors.BLUE_500"
    :text-color="colors.WHITE"
    style="min-width: 135px;"
  >
    Show MST (S)
  </Button>
  <Button
    v-else
    @click="hideMST"
    :color="colors.RED_600"
    :text-color="colors.WHITE"
    style="min-width: 135px;"
  >
    Hide MST (S)
  </Button>
  <div
    v-if="!simControls.isActive.value"
    class="gap-3 flex"
  >
    <Button
      v-for="algorithm in MST_ALGORITHMS"
      @click="() => startSimulation(algorithm)"
      class="capitalize"
    >
      Run {{ algorithm }}s
    </Button>
  </div>

  <Button
    v-else
    @click="simControls.stop"
    :color="colors.RED_600"
    :text-color="colors.WHITE"
    class="capitalize"
  >
    Stop Simulation
  </Button>
</template>
