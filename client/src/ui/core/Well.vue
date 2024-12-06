<script setup lang="ts">
  import colors from "@utils/colors";

  withDefaults(
    defineProps<{
      color?: string;
    }>(),
    {
      color: colors.BLUE_500,
    }
  );
</script>

<template>
  <div
    :style="{ backgroundColor: color }"
  >
    <slot><!-- optional fallback --></slot>
  </div>
</template>
