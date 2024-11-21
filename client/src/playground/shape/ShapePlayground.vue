<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useDark, useWindowSize } from "@vueuse/core";
  import ResponsiveCanvas from "@utils/components/ResponsiveCanvas.vue";
  import colors, { AMBER_400 } from "@colors";
  import { shapes } from "@shapes";
  import type { Shape } from "@shape/types";
  import { getCtx } from "@utils/ctx";
  import ShapePlaygroundToolbar from "./Toolbar.vue";

  const canvas = ref<HTMLCanvasElement>();
  const isDark = useDark();

  const color = computed(() =>
    isDark.value ? colors.GRAY_800 : colors.GRAY_200
  );

  const items = ref<Shape[]>([]);

  const patternColor = computed(
    () => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + "15"
  );

  const draw = () => {
    const ctx = getCtx(canvas);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const { circle, uturn, cross, rect, square, triangle, scribble } = shapes;

    items.value.push(
      circle({
        at: { x: 200, y: 200 },
        radius: 50,
        color: colors.BLUE_500,
        stroke: {
          color: colors.BLUE_700,
          width: 10,
          dash: [10, 5]
        },
        textArea: {
          text: {
            content: '51',
            color: colors.WHITE,
            fontSize: 20,
          },
          color: colors.TRANSPARENT
        }
      })
    );

    items.value.push(
      triangle({
        point1: { x: 800, y: 100 },
        point2: { x: 900, y: 200 },
        point3: { x: 700, y: 200 },
        color: colors.BLUE_500,
      })
    )

    items.value.push(
      uturn({
        at: { x: 600, y: 100 },
        downDistance: 50,
        upDistance: 50,
        lineWidth: 10,
        color: colors.BLUE_500,
        rotation: Math.PI * 0.2,
        spacing: 20,
        textArea: {
          color: colors.PURPLE_500,
          activeColor: colors.PURPLE_600,
          text: {
            content: "5",
            color: colors.WHITE,
            fontSize: 20,
          },
        },
      })
    );

    const lineTest = shapes.line({
      start: { x: 100, y: 100 },
      end: { x: 600, y: 900 },
      color: colors.GRAY_900,
      width: 10,
      textArea: {
        color: colors.PURPLE_500,
        activeColor: colors.PURPLE_600,
        text: {
          content: "5",
          color: colors.WHITE,
          fontSize: 20,
        },
      },
    })

    items.value.push(lineTest);

    items.value.push(
      cross({
        at: { x: 500, y: 300 },
        color: colors.SLATE_600,
        size: 150,
        rotation: Math.PI / 0.6,
        borderRadius: 10,
        lineWidth: 80,
      })
    );

    items.value.push(
      square({
        at: { x: 600, y: 400 },
        size:120,
        rotation: Math.PI / 0.7,
        color: colors.GREEN_600,
        borderRadius: 25,
        stroke: {
          color: colors.YELLOW_200,
          width: 10,
          dash: [10, 5]
        },
        textArea: {
          text: {
            content: '13',
            color: colors.WHITE,
            fontSize: 20,
          },
          color: AMBER_400
        }
      })
    )

    items.value.push(
      scribble({
        type: 'draw',
        brushWeight: 10,
        points: [
          { x: 534, y: 612 },
          { x: 682, y: 537 },
          { x: 799, y: 654 },
          { x: 935, y: 580 },
          { x: 620, y: 695 },
          { x: 1110, y: 612 },
          { x: 850, y: 530 },
          { x: 715, y: 598 },
          { x: 1200, y: 700 },
          { x: 500, y: 500 }
        ]
      })
    )

    items.value.forEach((item) => item.draw(ctx));
  };

  document.addEventListener("resize", draw);

  document.addEventListener("keyup", (e) => {
    if (e.code === "Space") draw();
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
