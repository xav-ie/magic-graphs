<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useDark } from '@vueuse/core';
import ResponsiveCanvas from '@utils/components/ResponsiveCanvas.vue';
import colors from '@colors';
import { drawShape } from '@shape/draw';

const canvas = ref<HTMLCanvasElement>();
const isDark = useDark();
const color = computed(() => isDark.value ? colors.GRAY_800 : colors.GRAY_200);
const patternColor = computed(() => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + '15');

const getCtx = () => {
  if (!canvas.value) throw new Error('canvas not found');
  const ctx = canvas.value.getContext('2d');
  if (!ctx) throw new Error('2d context not found');
  return ctx;
};


const draw = () => {
  const ctx = getCtx();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log('draw');
  const {
    drawCircle,
    drawTriangle,
    drawRectangle,
    drawSquare,
    drawLine,
    drawArrow,
    drawUTurnArrow,
  } = drawShape(ctx);

  drawCircle({
    at: { x: 100, y: 100 },
    radius: 50,
    color: colors.BLUE_500,
  });
};

document.addEventListener('resize', draw);
document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') draw();
});

setTimeout(draw, 100);
</script>

<template>
  <div class="h-full w-full">
    <ResponsiveCanvas
      @canvas-ref="(el) => canvas = el"
      :color="color"
      :pattern-color="patternColor"
    ></ResponsiveCanvas>
  </div>
</template>