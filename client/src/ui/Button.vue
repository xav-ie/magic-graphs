<script setup lang="ts">
  import { computed, useAttrs } from "vue";
  import { darkenHex } from "@utils/colors";

  const props = defineProps<{
    /**
     * The color of the button.
     */
    color?: string;
    /**
     * The text color of the button.
     */
    textColor?: string;
  }>();

  const propClasses = computed(() => {
    const classes = [];
    if (props.color) {
      classes.push(`bg-[${props.color}]`);
      classes.push(`dark:bg-[${props.color}]`);

      const adjustedColor = darkenHex(props.color, 30);
      classes.push(`hover:!bg-[${adjustedColor}]`);
      classes.push(`dark:hover:!bg-[${adjustedColor}]`);
    }

    if (props.textColor) {
      classes.push(`text-[${props.textColor}]`);
      classes.push(`dark:text-[${props.textColor}]`);
    }

    return classes
  });

  const { class: classAttr } = useAttrs();

  const parentClasses = computed<string[]>(() => {
    if (!classAttr) return [];
    if (typeof classAttr !== "string") return [];
    return classAttr.split(" ").map((c) => "!" + c.trim());
  });

  const classList = computed(() => [
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
    "items-center",
    "justify-center",
    ...parentClasses.value,
    ...propClasses.value,
  ]);
</script>

<template>
  <button :class="classList">
    <slot></slot>
  </button>
</template>
