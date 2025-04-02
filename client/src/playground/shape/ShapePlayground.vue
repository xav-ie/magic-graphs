<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useDark, useWindowSize } from '@vueuse/core';
  import ResponsiveCanvas from '@utils/components/ResponsiveCanvas.vue';
  import colors, { AMBER_400 } from '@colors';
  import { shapes } from '@shapes';
  import type { Coordinate, Shape } from '@shape/types';
  import { getCtx } from '@utils/ctx';
  import ShapePlaygroundToolbar from './Toolbar.vue';

  const canvas = ref<HTMLCanvasElement>();
  const isDark = useDark();

  const color = computed(() =>
    isDark.value ? colors.GRAY_800 : colors.GRAY_200,
  );

  const items = ref<Shape[]>([]);

  const patternColor = computed(
    () => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + '15',
  );

  const draw = () => {
    const ctx = getCtx(canvas);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const {
      uturn,
      cross,
      ellipse,
      square,
      triangle,
      scribble,
      line,
      star,
      image,
    } = shapes;

    items.value.push(
      ellipse({
        at: { x: 200, y: 200 },
        radiusX: 50,
        radiusY: 90,
        color: colors.BLUE_500,
        stroke: {
          color: colors.BLUE_700,
          width: 10,
          dash: [10, 5],
        },
        textArea: {
          text: {
            content: 'dsadsadsadsadsadsadsa',
            color: colors.WHITE,
            fontSize: 10,
          },
          color: colors.TRANSPARENT,
        },
      }),
    );

    items.value.push(
      line({
        start: { x: 1500, y: 100 },
        end: { x: 1200, y: 900 },
        width: 10,
        gradientStops: [
          { offset: 0.1, color: colors.GREEN_400 },
          { offset: 0.5, color: colors.RED_600 },
          { offset: 0.9, color: colors.BLUE_700 },
        ],
      }),
    );

    items.value.push(
      triangle({
        pointA: { x: 800, y: 100 },
        pointB: { x: 900, y: 200 },
        pointC: { x: 700, y: 200 },
        color: colors.BLUE_500,
      }),
    );

    items.value.push(
      uturn({
        at: { x: 600, y: 100 },
        downDistance: 50,
        upDistance: 50,
        lineWidth: 10,
        rotation: Math.PI * 0.2,
        spacing: 20,
        gradientStops: [
          { offset: 0.1, color: colors.GREEN_400 },
          { offset: 0.5, color: colors.RED_600 },
          { offset: 0.9, color: colors.BLUE_700 },
        ],
      }),
    );

    const lineTest = shapes.arrow({
      start: { x: 100, y: 100 },
      end: { x: 600, y: 900 },
      color: colors.GRAY_900,
      width: 10,
      arrowHeadSize: () => {
        return { arrowHeadHeight: 100, perpLineLength: 100 };
      },
      arrowHeadShape: (at: Coordinate, width: number, height: number) =>
        square({
          at: { x: at.x - height + 18, y: at.y - height },
          size: height,
          color: colors.GRAY_900,
          rotation: Math.atan2(100 - 900, 100 - 600) + Math.PI / 4,
        }),
      textArea: {
        color: colors.PURPLE_500,
        activeColor: colors.PURPLE_600,
        text: {
          content: '5',
          color: colors.WHITE,
          fontSize: 20,
        },
      },
    });

    items.value.push(lineTest);

    items.value.push(
      cross({
        at: { x: 500, y: 300 },
        color: colors.SLATE_600,
        size: 150,
        rotation: Math.PI / 0.6,
        borderRadius: 10,
        lineWidth: 80,
      }),
    );

    items.value.push(
      square({
        at: { x: 600, y: 400 },
        size: 120,
        rotation: Math.PI / 0.7,
        color: colors.GREEN_600,
        borderRadius: 25,
        stroke: {
          color: colors.YELLOW_200,
          width: 10,
          dash: [10, 5],
        },
        textArea: {
          text: {
            content: '13',
            color: colors.WHITE,
            fontSize: 20,
          },
          color: AMBER_400,
        },
      }),
    );

    items.value.push(
      scribble({
        type: 'draw',
        brushWeight: 10,
        points: [
          { x: 534, y: 612 },
          { x: 535, y: 612 },
        ],
      }),
    );

    items.value.push(
      ...[
        {
          at: { x: 700, y: 300 },
          color: colors.YELLOW_500,
          innerRadius: 8,
          outerRadius: 20,
          points: 5,
          rotation: Math.PI / 4,
        },
        {
          at: { x: 730, y: 280 },
          color: colors.YELLOW_400,
          innerRadius: 6,
          outerRadius: 15,
          points: 6,
          rotation: Math.PI / 4,
        },
        {
          at: { x: 670, y: 290 },
          color: colors.YELLOW_600,
          innerRadius: 4,
          outerRadius: 12,
          points: 7,
          rotation: Math.PI / 6,
        },
      ].map(star),
    );

    const onLoad = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      items.value.forEach((item) => item.draw(ctx));
    };

    items.value.push(
      image({
        at: { x: 50, y: 425 },
        width: 100,
        height: 100,
        src: '/WillNeverBeFound.png',
        textArea: {
          text: {
            content: 'Epic fail',
            color: colors.WHITE,
            fontSize: 20,
          },
          color: colors.RED_600,
        },
        onLoad,
        onLoadError: onLoad,
      }),
      image({
        at: { x: 200 - 1600 / 6 / 2, y: 700 - 1200 / 6 / 2 },
        width: 1600 / 6,
        height: 1200 / 6,
        textArea: {
          text: {
            content: 'Llama',
            color: colors.WHITE,
            fontSize: 20,
          },
          color: colors.GREEN_600,
        },
        rotation: 0.1,
        src: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Lama_glama_in_Junsele.jpg',
        onLoad,
      }),
      square({
        at: { x: 215, y: 575 },
        size: 1,
        textArea: {
          text: {
            content: '© EmojiOne (CC-BY-SA 4.0)',
            color: colors.BLACK,
            fontSize: 12,
          },
          color: colors.TRANSPARENT,
        },
        color: colors.TRANSPARENT,
      }),
      image({
        at: { x: 50, y: 550 },
        width: 80,
        height: 80,
        src: '/1F639.png',
        rotation: -0.2,
        onLoad,
      }),
    );

    items.value.forEach((item) => item.draw(ctx));
  };

  document.addEventListener('resize', draw);

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') draw();
  });

  setTimeout(draw, 100);

  const { width, height } = useWindowSize();
</script>

<template>
  <div class="h-full w-full">
    <div class="absolute m-3 flex gap-3 z-50">
      <ShapePlaygroundToolbar
        :canvas="canvas"
        :items="items"
        :draw="draw"
      />
    </div>

    <ResponsiveCanvas
      @canvas-ref="(el) => (canvas = el)"
      :color="color"
      :pattern-color="patternColor"
      :canvas-width="width"
      :canvas-height="height"
    ></ResponsiveCanvas>
  </div>
</template>
