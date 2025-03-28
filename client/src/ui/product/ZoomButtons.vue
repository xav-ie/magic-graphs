<script setup lang="ts">
  import GToolbarButton from '@ui/graph/toolbar/GToolbarButton.vue';
  import GToolbarBase from '@ui/graph/toolbar/GToolbarBase.vue';
  import ToolbarButtonGroup from '@ui/core/toolbar/ToolbarButtonGroup.vue';
  import {
    scale,
    MAX_SCALE,
    MIN_SCALE,
    zoomIn,
    zoomOut,
  } from '@utils/components/usePinchToZoom';
  import GWell from '@ui/graph/GWell.vue';
  import { computed } from 'vue';

  const scalePercentage = computed(() => (scale.value * 100).toFixed(0));
</script>

<template>
  <GToolbarBase>
    <ToolbarButtonGroup>
      <GToolbarButton
        @click="zoomOut()"
        :disabled="scale <= MIN_SCALE"
        icon="minus"
      ></GToolbarButton>
      <GWell class="w-12 text-center">
        <p class="text-sm font-semibold">{{ scalePercentage }}%</p>
      </GWell>
      <GToolbarButton
        @click="zoomIn()"
        :disabled="scale >= MAX_SCALE"
        icon="plus"
      ></GToolbarButton>
    </ToolbarButtonGroup>
  </GToolbarBase>
</template>
