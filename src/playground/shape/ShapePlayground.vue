<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useDark } from "@vueuse/core";
  import ResponsiveCanvas from "@utils/components/ResponsiveCanvas.vue";
  import colors from "@colors";
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
    const { circle, uturn, square } = shapes;

    items.value.push(
      circle({
        at: { x: 200, y: 200 },
        radius: 50,
        color: colors.BLUE_500,
        stroke: {
          color: colors.BLUE_700,
          width: 10,
        },
      })
    );

    items.value.push(
      uturn({
        center: { x: 600, y: 100 },
        downDistance: 50,
        upDistance: 50,
        lineWidth: 10,
        color: colors.BLUE_500,
        angle: Math.PI * 0.2,
        spacing: 20,
        textArea: {
          color: colors.PURPLE_500,
          text: {
            content: "5",
            color: colors.WHITE,
            fontSize: 20,
          },
        },
      })
    );

    items.value.push(
      square({
        at: { x: 500, y: 300 },
        color: colors.PINK_500,
        size: 500,
      })
    );

    items.value.forEach((item) => item.draw(ctx));
  };

  document.addEventListener("resize", draw);

  document.addEventListener("keyup", (e) => {
    if (e.code === "Space") draw();
  });

  setTimeout(draw, 100);
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
      :open-world-factor="1"
    ></ResponsiveCanvas>
  </div>
</template>
