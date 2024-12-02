<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from "vue";
  import type { UnwrapRef } from "vue";
  import GraphCanvas from "@graph/Graph.vue";
  import { useGraphProduct } from "@graph/useGraphProduct";
  import type { Graph } from "@graph/types";
  import SimulationPlaybackControls from "@ui/product/sim/SimulationPlaybackControls.vue";
  import AnnotationControls from "@product/graph-sandbox/ui/AnnotationControls.vue";
  import ProductDropdown from "@ui/product/dropdown/ProductDropdown.vue";
  import SelectSimulation from "@ui/product/sim/SelectSimulation.vue";
  import type { SimulationDeclaration } from "src/types";
  import { getSimulationDeclarationsForProduct } from "@utils/product";
  import StartSimButton from "./StartSimButton.vue";
  import StopSimButton from "./StopSimButton.vue";
  import Button from "@ui/Button.vue";
  import colors from "@utils/colors";
  import { useShortcutPressed } from "@graph/compositions/useUserEditableGraph/useShortcutPressed";
  import { useFullscreen } from '@vueuse/core'

  const { toggle: toggleFullscreen } = useFullscreen()

  const props = defineProps<{
    graph: Graph;
  }>();

  const emit = defineEmits<{
    (e: "graph-ref", value: HTMLCanvasElement | undefined): void;
    (e: "simulation-started", value: UnwrapRef<SimulationDeclaration>): void;
    (e: "simulation-stopped"): void;
  }>();

  const simulations = getSimulationDeclarationsForProduct(props.graph);

  const activeSimulation = ref(simulations[0]);
  const runningSimulation = ref(false);

  const simRunner = computed(() => activeSimulation.value.runner);
  const isActive = computed(() => simRunner.value.simControls.isActive);

  const startSimulation = async () => {
    runningSimulation.value = true;
    emit("simulation-started", activeSimulation.value);
    await simRunner.value.start();
  };

  const stopSimulation = async () => {
    await simRunner.value.stop();
    runningSimulation.value = false;
    emit("simulation-stopped");
  };

  const setActiveSimulation = (simulation: SimulationDeclaration) => {
    activeSimulation.value = simulation;
    startSimulation();
  };

  const graphEl = ref<HTMLCanvasElement>();

  useGraphProduct(props.graph);

  const KEY_BINDINGS = {
    Mac: {
      ['F']: toggleFullscreen,
    },
    Windows: {
      ['F']: toggleFullscreen,
    },
  } as const

  const USER_PLATFORM = window.navigator.userAgent.includes('Mac') ? 'Mac' : 'Windows'

  const { isPressed } = useShortcutPressed()

  const handleKeyboardEvents = () => {
    const userKeyBindings = KEY_BINDINGS[USER_PLATFORM]
    for (const key in userKeyBindings) {
      if (isPressed(key)) userKeyBindings[key as keyof typeof userKeyBindings]()
    }
  }

  onMounted(() => {
    emit("graph-ref", graphEl.value);
    document.addEventListener('keydown', handleKeyboardEvents);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyboardEvents);
  });
</script>

<template>
  <GraphCanvas
    @graph-ref="(el) => (graphEl = el)"
    :graph="graph"
  />

  <div
    class="absolute top-6 w-full flex flex-col justify-center items-center gap-2"
  >
    <template v-if="runningSimulation">
      <slot name="top-center-sim"></slot>
    </template>
    
    <template v-else>
      <slot name="top-center"></slot>
    </template>
  </div>

  <div class="absolute grid place-items-center left-4 top-0 h-full max-w-96">
    <div
      class="relative max-h-3/4 w-full grid place-items-center overflow-auto"
    >
      <template v-if="runningSimulation">
        <slot name="center-left-sim"></slot>
      </template>

      <template v-else>
        <slot name="center-left"></slot>
      </template>
    </div>
  </div>

  <div class="absolute grid place-items-center right-4 top-0 h-full max-w-96">
    <div
      class="relative max-h-3/4 w-full grid place-items-center overflow-auto"
    >
      <template v-if="runningSimulation">
        <slot name="center-right-sim"></slot>
      </template>

      <template v-else>
        <slot name="center-right"></slot>
      </template>
    </div>
  </div>

  <div class="absolute top-6 left-6">
    <ProductDropdown />
  </div>

  <div class="absolute top-6 right-6">
    <template v-if="runningSimulation">
      <slot name="top-right-sim">
        <StopSimButton @click="stopSimulation" />
      </slot>
    </template>

    <template v-else>
      <slot name="top-right">
        <template v-if="simulations.length > 1">
          <SelectSimulation
            @simulation-selected="setActiveSimulation"
            :simulations="simulations"
          />
        </template>
        <template v-else>
          <StartSimButton @click="startSimulation" />
        </template>
      </slot>
    </template>
  </div>

  <div
    class="absolute bottom-8 gap-4 w-full flex flex-col justify-center items-center"
  >
    <div v-if="isActive">
      <SimulationPlaybackControls :controls="simRunner.simControls" />
    </div>

    <div v-show="graph.annotationActive.value">
      <AnnotationControls />
    </div>
    <div 
      class="absolute bottom-0 right-8"
    >
      <Button 
        @click="toggleFullscreen"
        :color="colors.GRAY_800" 
        :text-color="colors.WHITE" 
        class="aspect-square"
      >
        <v-icon>mdi-fullscreen</v-icon>
      </Button>
    </div>
  </div>
</template>
