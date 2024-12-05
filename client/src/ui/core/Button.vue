<script setup lang="ts">
  import { computed } from "vue";
  import tinycolor from "tinycolor2";
  import { twMerge } from "tailwind-merge";
  import { useClassAttrs } from "@ui/useClassAttrs";

  const props = defineProps<{
    /**
     * the background color of the button.
     */
    color?: string;
    /**
     * the text color of the button. if not set,
     * it will be automatically determined based on the background color.
     */
    textColor?: string;
    /**
     * whether the button is disabled.
     */
    disabled?: boolean;
  }>();

  const color = computed(() => {
    if (!props.color) return;
    const tinycolorInstance = tinycolor(props.color);
    if (!tinycolorInstance.isValid()) {
      throw new Error("invalid color provided to button");
    }
    return tinycolorInstance;
  });

  const parentClassList = useClassAttrs();

  const defaultButtonClasses = [
    "px-2",
    "py-1",

    "bg-gray-800",
    "text-gray-200",

    "dark:bg-gray-200",
    "dark:text-gray-800",

    "hover:bg-gray-700",
    "dark:hover:bg-gray-300",

    "rounded-md",
    "cursor-pointer",
    "font-bold",

    "flex",
    "justify-center",
    "items-center",
  ];

  const classes = computed(() => {
    const twClasses = twMerge(defaultButtonClasses, parentClassList.value);
    return twClasses + (color.value ? ' insert-hover-color' : '');
  });

  const disabled = computed(() => props.disabled);

  const textColor = computed(() => {
    if (props.textColor) {
      return props.textColor;
    }

    if (!color.value) return;
    return color.value.isDark() ? "white" : "black";
  });

  const styles = computed(() => {
    const disabledStyles = {
      pointerEvents: "none",
      opacity: 0.5,
      cursor: "not-allowed",
    } as const;

    const colorStyles = {
      backgroundColor: color.value?.toHexString(),
      color: textColor.value,
      "--hover-color": color.value?.darken().toHexString(),
    } as const;

    return {
      ...(props.color ? colorStyles : {}),
      ...(disabled.value ? disabledStyles : {}),
    };
  });
</script>

<template>
  <button
    :class="classes"
    :style="styles"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
  .insert-hover-color:hover {
    background-color: var(--hover-color) !important;
  }
</style>
