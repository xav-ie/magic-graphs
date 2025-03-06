<script setup lang="ts">
  import GToolbarButton from '@ui/graph/toolbar/GToolbarButton.vue';
  import GToolbarBase from '@ui/graph/toolbar/GToolbarBase.vue';
  import ToolbarButtonGroup from '@ui/core/toolbar/ToolbarButtonGroup.vue';
  import { scale } from '@utils/components/usePinchToZoom';
  import GWell from '@ui/graph/GWell.vue';

  const setScale = (scaleChange: number) => {
    scale.value = Math.round((scale.value + scaleChange) * 10) / 10;
  };
</script>

<template>
  <GToolbarBase>
    <ToolbarButtonGroup>
      <GToolbarButton
        @click="setScale(0.1)"
        icon="plus"
      ></GToolbarButton>
      <GWell>
        <p class="text-sm">{{ (scale * 100).toFixed(0) }}%</p>
      </GWell>
      <GToolbarButton
        @click="setScale(-0.1)"
        icon="minus"
      ></GToolbarButton>
    </ToolbarButtonGroup>
  </GToolbarBase>
</template>
