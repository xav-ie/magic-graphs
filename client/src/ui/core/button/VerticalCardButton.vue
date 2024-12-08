<script setup lang="ts">
  import { computed, ref } from "vue";
  import colors from "@utils/colors";
  import tinycolor from "tinycolor2";

  const props = withDefaults(
    defineProps<{
      imageSrc?: string;
      color?: string;
      hoverColor?: string;
      title?: string;
      description?: string;
    }>(),
    {
      color: colors.GRAY_800,
    }
  );

  const hoverColor = computed(() => {
    if (props.hoverColor) return props.hoverColor;
    const color = tinycolor(props.color);
    const adjustedColor = color.isDark() ? color.lighten(10) : color.darken(10);
    return adjustedColor.toHexString();
  });

  const bgColor = computed(() =>
    hovered.value ? hoverColor.value : props.color
  );

  const hovered = ref(false);
</script>

<template>
  <button
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :style="{
      backgroundColor: bgColor,
    }"
    class="p-2 cursor-pointer text-left flex gap-4"
  >
    <img
      v-if="imageSrc"
      :src="imageSrc"
      class="object-cover h-20 w-20 rounded-md"
    />
    <div class="flex flex-col gap-1">
      <h1 class="text-lg font-bold">
        {{ title }}
      </h1>
      <p class="text-sm opacity-80">
        {{ description }}
      </p>
    </div>
  </button>
</template>
