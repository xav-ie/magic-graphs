<script setup lang="ts">
  import { ref } from 'vue';
  import type { Graph } from '@graph/types';
  import ResponsiveCanvas from '@utils/components/ResponsiveCanvas.vue';

  const props = defineProps<{
    graph: Graph;
  }>();

  const emit = defineEmits<{
    (e: 'graphRef', value: HTMLCanvasElement | undefined): void;
  }>();

  const emitRef = (el: HTMLCanvasElement | undefined) => emit('graphRef', el);

  const patternColor = ref(props.graph.getTheme('graphBgPatternColor'));
  const bgColor = ref(props.graph.getTheme('graphBgColor'));

  const changeCanvasColor = async () => {
    patternColor.value = props.graph.getTheme('graphBgPatternColor');
    bgColor.value = props.graph.getTheme('graphBgColor');
  };

  props.graph.subscribe('onThemeChange', changeCanvasColor);
</script>

<template>
  <ResponsiveCanvas
    @canvas-ref="emitRef"
    :color="bgColor"
    :pattern-color="patternColor"
  />
</template>
