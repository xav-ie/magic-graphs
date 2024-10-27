<script setup lang="ts">
  defineProps<{
    width: number;
    height: number;
  }>();

  const emit = defineEmits<{
    (e: 'graphRef', value: HTMLCanvasElement | undefined): void;
  }>()

  const emitRef = (el: HTMLCanvasElement | undefined) => emit('graphRef', el)
</script>

<template>
  <div>
    <canvas
      :width="width"
      :height="height"
      :ref="(emitRef as any)"
      :class="[`w-[${width}px]`, `h-[${height}px]`]"
    ></canvas>
  </div>
</template>
