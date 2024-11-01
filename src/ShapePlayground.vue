<script setup lang="ts">
  import { ref, computed, watch } from "vue";
  import { useDark } from "@vueuse/core";
  import ResponsiveCanvas from "@utils/components/ResponsiveCanvas.vue";
  import colors from "@colors";
  import { shapes } from "@shapes";
  import type { Shape } from "@shape/types";
  import { debounce } from "@utils/debounce";
import { useHeatmap } from "@utils/playground/useHeatmap";
import { getCtx } from "@utils/ctx";

  const canvas = ref<HTMLCanvasElement>();
  const isDark = useDark();

  const color = computed(() =>
    isDark.value ? colors.GRAY_800 : colors.GRAY_200
  );

  const items = ref<Shape[]>([]);
  const { heatmapActive, heatmapResolution } = useHeatmap(canvas, items);

  const heatmapBtnText = computed(() =>
    heatmapActive.value ? "Hide Heatmap" : "Show Heatmap"
  );

  const patternColor = computed(
    () => (isDark.value ? colors.GRAY_200 : colors.GRAY_700) + "15"
  );

  const testForHitbox = () => {
    const { width, height } = canvas!.value!.getBoundingClientRect();
    const SAMPLING_RATE = heatmapResolution.value;
    for (let i = 0; i < width; i += SAMPLING_RATE) {
      for (let j = 0; j < height; j += SAMPLING_RATE) {
        const shapeHit = items.value.findLast((item) =>
          item.hitbox({ x: i, y: j })
        );
        const textHit = items.value.findLast((item) =>
          item.textHitbox?.({ x: i, y: j })
        );
        if (textHit) {
          shapes
            .circle({
              at: { x: i, y: j },
              radius: 2,
              color: colors.YELLOW_500,
            })
            .draw(getCtx());
        } else if (shapeHit) {
          shapes
            .circle({
              at: { x: i, y: j },
              radius: 2,
              color: colors.RED_500,
            })
            .draw(getCtx());
        } else {
          shapes
            .circle({
              at: { x: i, y: j },
              radius: 2,
              color: colors.GREEN_500,
            })
            .draw(getCtx());
        }
      }
    }
  };

  const draw = () => {
    const ctx = getCtx(canvas.value)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const { circle, rect, square, triangle, line, arrow, uturn, cross } =
      shapes;

    items.value.push(circle({
      at: { x: 200, y: 200 },
      radius: 50,
      color: colors.BLUE_500,
      stroke: {
        color: colors.BLUE_700,
        width: 10,
      },
    }));

    items.value.push(uturn({
      center: { x: 400, y: 200 },
      downDistance: 50,
      upDistance: 50,
      lineWidth: 10,
      color: colors.BLUE_500,
      angle: 0,
      spacing: 20,
      textArea: {
        color: colors.PURPLE_500,
        text: {
          content: "5",
          color: colors.WHITE,
          fontSize: 50,
        },
      },
    }))


    items.value.forEach((item) => item.draw(ctx));
    if (heatmapActive.value) testForHitbox();
  };

  document.addEventListener("resize", draw);
  document.addEventListener("keyup", (e) => {
    if (e.code === "Space") draw();
  });

  const debouncedDraw = debounce(draw, 500);

  watch(heatmapActive, draw);
  watch(heatmapResolution, debouncedDraw);

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
    <button
      @click="heatmapActive = !heatmapActive"
      :class="[
        'absolute',
        'top-4',
        'left-[105px]',
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
      {{ heatmapBtnText }}
    </button>
    <div class="absolute top-4 left-[250px] flex items-center z-50 gap-4">
      <input
        v-if="heatmapActive"
        type="range"
        min="1"
        max="10"
        v-model.number="heatmapResolution"
        id="heatmapResolution"
      />
      <label
        class="text-white"
        v-if="heatmapActive"
        for="heatmapResolution"
      >
        Resolution: {{ heatmapResolution }}
      </label>
    </div>
    <ResponsiveCanvas
      @canvas-ref="(el) => (canvas = el)"
      :color="color"
      :pattern-color="patternColor"
      :open-world-factor="1"
    ></ResponsiveCanvas>
  </div>
</template>
