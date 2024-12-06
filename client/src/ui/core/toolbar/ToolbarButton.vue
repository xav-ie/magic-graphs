<script setup lang="ts">
  import { computed, ref, toRef } from "vue";
  import CIcon from "@ui/core/Icon.vue";
  import { useTinycolor } from "@ui/useTinycolor";
  import colors from "@utils/colors";
  import tinycolor from "tinycolor2";

  const props = withDefaults(
    defineProps<{
      color?: string;
      active?: boolean;
      activeColor?: string;
      disabled?: boolean;
      icon?: string;
    }>(),
    {
      color: colors.GRAY_800,
      active: false,
      disabled: false,
      icon: "",
    }
  );

  const colorRef = toRef(props, "color");
  const color = useTinycolor(colorRef);

  const hoverColor = computed(() => {
    return color.value.darken(5).toHexString();
  });

  const activeColor = computed(() => {
    if (props.activeColor) return props.activeColor;
    return color.value.darken(10).toHexString();
  });

  const bgColor = computed(() => {
    if (props.disabled) return;
    if (props.active) return activeColor.value;
    if (hovered.value) return hoverColor.value;
    return props.color;
  });

  const textColor = computed(() => {
    const standardTextColor = color.value.isDark()
      ? colors.WHITE
      : colors.BLACK;
    if (props.disabled) return standardTextColor + "80";
    return standardTextColor;
  });

  const styles = computed(() => {
    return {
      color: textColor.value,
      backgroundColor: bgColor.value,
      cursor: props.disabled ? "not-allowed" : "pointer",
    };
  });

  const hovered = ref(false);
</script>

<template>
  <button
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :disabled="disabled"
    :class="['p-1', 'rounded-md', 'grid', 'place-items-center', 'w-10', 'h-10']"
    :style="styles"
  >
    <slot>
      <CIcon :icon="icon" />
    </slot>
  </button>
</template>
