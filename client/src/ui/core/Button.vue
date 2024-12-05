<script setup lang="ts">
  import { computed } from "vue";
  import { twMerge } from "tailwind-merge";
  import { useClassAttrs } from "@ui/useClassAttrs";
  import { darkenHex, getLuminance, isHex } from "@utils/colors";

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
    return twMerge(defaultButtonClasses, parentClassList.value);
  });

  const disabled = computed(() => props.disabled);

  const textColor = computed(() => {
    if (props.textColor) {
      return props.textColor;
    }

    if (!props.color) {
      // if no color is provided, no need to resolve text color
      return ''
    }

    if (props.color && isHex(props.color)) {
      return getLuminance(props.color) > 0.5 ? "black" : "white";
    }

    console.warn('could not resolve text color for button with color', props.color);
    return "white";
  });

  const styles = computed(() => {
    const disabledStyles = {
      pointerEvents: "none",
      opacity: 0.5,
      cursor: "not-allowed",
    } as const;

    const colorStyles = {
      backgroundColor: props.color,
      color: textColor.value,
      "--hover-color": darkenHex(props.color || "", 30),
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
