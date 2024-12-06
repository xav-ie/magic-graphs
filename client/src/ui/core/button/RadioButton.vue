<script setup lang="ts">
  import { useTinycolor } from "@ui/useTinycolor";
  import colors from "@utils/colors";
  import { computed, ref, toRef } from "vue";

  const props = withDefaults(
    defineProps<{
      color?: string;
      active?: boolean;
    }>(),
    {
      active: false,
      color: colors.WHITE,
    }
  );

  const colorRef = toRef(props, "color");
  const color = useTinycolor(colorRef);
  const hoverColorHex = computed(() => color.value.darken(30).toHexString());

  const borderColorHex = computed(() => {
    if (props.active) return props.color;
    if (hovered.value) return hoverColorHex.value;
    return colors.TRANSPARENT;
  })

  const classes = ["cursor-pointer", "rounded-xl", "p-1", "border-2"];

  const hovered = ref(false);
</script>

<template>
  <button
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :class="classes"
    :style="{
      borderColor: borderColorHex,
    }"
  >
    <div
      :class="[
        'relative',
        'w-8',
        'h-8',
        'rounded-md',
        'flex',
        'items-center',
        'justify-center',
        'text-white',
        'text-sm',
        active ? 'bg-gray-800' : 'bg-gray-700',
      ]"
    >
      <slot></slot>
    </div>
  </button>
</template>
