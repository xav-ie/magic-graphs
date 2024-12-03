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
    /**
     * Whether the button is disabled.
     */
    disabled?: boolean;
  }>();

  const propClasses = computed(() => {
    const classes = [];
    if (props.color) {
      classes.push(`!bg-[${props.color}]`);
      classes.push(`dark:!bg-[${props.color}]`);

      const adjustedColor = darkenHex(props.color, 30);
      classes.push(`hover:!bg-[${adjustedColor}]`);
      classes.push(`dark:hover:!bg-[${adjustedColor}]`);
    }

    if (props.textColor) {
      classes.push(`!text-[${props.textColor}]`);
      classes.push(`dark:!text-[${props.textColor}]`);
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

  const disabled = computed(() => props.disabled);

  const disabledStyle = computed(() => {
    if (disabled.value) {
      return {
        pointerEvents: "none",
        opacity: 0.5,
        cursor: "not-allowed",
      } as const;
    }
    return {} as const;
  });
</script>

<template>
  <button
    :class="classList"
    :style="disabledStyle"
  >
    <slot></slot>
  </button>
</template>
