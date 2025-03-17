<script setup lang="ts">
  import GToolbarButton from '@ui/graph/toolbar/GToolbarButton.vue';
  import GToolbarBase from '@ui/graph/toolbar/GToolbarBase.vue';
  import ToolbarButtonGroup from '@ui/core/toolbar/ToolbarButtonGroup.vue';
  import {
    scale,
    MAX_SCALE,
    MIN_SCALE,
  } from '@utils/components/usePinchToZoom';
  import GWell from '@ui/graph/GWell.vue';

  const setScale = (scaleChange: number) => {
    scale.value = Math.round((scale.value + scaleChange) * 10) / 10;
  };
</script>

<template>
  <GToolbarBase>
    <ToolbarButtonGroup>
      <GToolbarButton
        @click="setScale(-0.1)"
        :disabled="scale <= MIN_SCALE"
        icon="minus"
      ></GToolbarButton>
      <GWell>
        <p class="text-sm w-[2rem] text-center">
          {{ (scale * 100).toFixed(0) }}%
        </p>
      </GWell>
      <GToolbarButton
        @click="setScale(0.1)"
        :disabled="scale >= MAX_SCALE"
        icon="plus"
      ></GToolbarButton>
    </ToolbarButtonGroup>
  </GToolbarBase>
</template>
