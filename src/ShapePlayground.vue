<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useDark } from "@vueuse/core";
  import ResponsiveCanvas from "@utils/components/ResponsiveCanvas.vue";
  import colors from "@colors";
  import { shapes } from "@shapes"
import { X } from "vitest/dist/chunks/reporters.C4ZHgdxQ.js";

  const canvas = ref<HTMLCanvasElement>();
  const isDark = useDark();
  const color = computed(() =>
    isDark.value ? colors.GRAY_800 : colors.GRAY_200
  );
  const patternColor = computed(
    () => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + "15"
  );

  const getCtx = () => {
    if (!canvas.value) throw new Error("canvas not found");
    const ctx = canvas.value.getContext("2d");
    if (!ctx) throw new Error("2d context not found");
    return ctx;
  };

  const draw = () => {
    const ctx = getCtx();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const {
      circle,
      rect,
      square,
      triangle,
      line,
      arrow,
      uturn,
      cross,
    } = shapes;

    const c = circle({
      at: { x: 200, y: 200 },
      radius: 50,
      color: colors.BLUE_500,
      stroke: {
        color: colors.BLUE_700,
        width: 10,
      }
    })
    c.draw(ctx)

    uturn({
      color: colors.BLUE_500,
      upDistance: 100,
      downDistance: 100,
      spacing: 15,
      center: { x: 525, y: 100 },
      lineWidth: 10,
      angle: Math.PI / 4,
      textArea: {
        color: color.value,
        text: {
          content: "4",
          color: colors.WHITE,
        },
      }
    }).draw(ctx);

    arrow({
      start: { x: 300, y: 100 },
      end: { x: 400, y: 200 },
      color: colors.BLUE_600,
      width: 10,
    }).draw(ctx);

    arrow({
      start: { x: 400, y: 100 },
      end: { x: 500, y: 200 },
      color: colors.BLUE_600,
      width: 10,
      textArea: {
        color: color.value,
        text: {
          content: "5",
          color: colors.WHITE,
        },
      }
    }).draw(ctx);


    triangle({
      point1: { x: 700, y: 300 },
      point2: { x: 200, y: 500 },
      point3: { x: 800, y: 500 },
      color: colors.BLUE_600,
    }).draw(ctx);

    rect({
      at: { x: 200, y: 600 },
      width: 200,
      height: 100,
      color: colors.BLUE_700,
    }).draw(ctx);

    square({
      at: { x: 500, y: 600 },
      size: 100,
      color: colors.BLUE_800,
    }).draw(ctx);

    line({
      start: { x: 200, y: 800 },
      end: { x: 800, y: 700 },
      color: colors.BLUE_900,
      width: 5,
    }).draw(ctx);

    cross({
      center: { x: 800, y: 800 },
      size: 100,
      color: colors.GREEN_500,
      lineWidth: 50,
      angle: Math.PI / 3,
    }).draw(ctx)

    canvas.value?.addEventListener("click", (e) => {
      const {offsetX: x, offsetY: y} = e
      console.log(c.hitbox({x, y}));
    });
  };
  


  document.addEventListener("resize", draw);
  document.addEventListener("keyup", (e) => {
    if (e.code === "Space") draw();
  });

  setTimeout(draw, 100);
</script>

<template>
  <div class="h-full w-full">
    <button
      @click="draw"
      :class="[
        'absolute',
        'top-4',
        'left-4',
        'px-2',
        'py-1',

        'bg-gray-800',
        'text-gray-200',

        'dark:bg-gray-200',
        'dark:text-gray-800',

        'hover:bg-gray-700',
        'dark:hover:bg-gray-300',

        'rounded-md',
        'cursor-pointer',
        'font-bold',
        'z-50',
      ]"
    >
      Redraw
    </button>
    <ResponsiveCanvas
      @canvas-ref="(el) => (canvas = el)"
      :color="color"
      :pattern-color="patternColor"
      :open-world-factor="1"
    ></ResponsiveCanvas>
  </div>
</template>
