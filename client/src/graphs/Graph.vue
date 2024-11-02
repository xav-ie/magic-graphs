<script setup lang="ts">
  import { ref } from "vue";
  import type { Graph } from "@graph/types";
  import ResponsiveCanvas from "@utils/components/ResponsiveCanvas.vue";
  import { debounce } from "@utils/debounce";

  const props = defineProps<{
    graph: Graph;
  }>();

  const emit = defineEmits<{
    (e: "graphRef", value: HTMLCanvasElement | undefined): void;
  }>();

  const emitRef = (el: HTMLCanvasElement | undefined) => emit("graphRef", el);

  const sizeChangeRepaint = props.graph.repaint(
    "graph-view/canvas-size-changed"
  );

  const repaintGraph = debounce(sizeChangeRepaint, 250);

  const patternColor = ref(props.graph.getTheme("graphBgPatternColor"));
  const bgColor = ref(props.graph.getTheme("graphBgColor"));

  props.graph.subscribe("onThemeChange", (diff) => {
    const { graphBgPatternColor, graphBgColor } = diff;
    if (graphBgPatternColor) patternColor.value = graphBgPatternColor;
    if (graphBgColor) bgColor.value = graphBgColor;
  });
</script>

<template>
  <ResponsiveCanvas
    @width-change="repaintGraph"
    @height-change="repaintGraph"
    @canvas-ref="emitRef"
    :color="bgColor"
    :pattern-color="patternColor"
  />
</template>
