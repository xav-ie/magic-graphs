<script setup lang="ts">
  import { useNonNullGraphColors } from '@graph/themes/useGraphColors';
  import { computed } from 'vue';
  import Dialog from 'primevue/dialog';

  const colors = useNonNullGraphColors();

  const props = withDefaults(
    defineProps<{
      /**
       * true if the well should use the secondary color
       * as the background color.
       */
      secondary?: boolean;
      tertiary?: boolean;
      contrast?: boolean;
    }>(),
    {
      secondary: false,
      tertiary: false,
      contrast: false,
    },
  );

  const color = computed(() => {
    if (props.secondary) return colors.value.secondary;
    if (props.tertiary) return colors.value.tertiary;
    return colors.value.primary;
  });
</script>

<template>
  <Dialog
    v-bind="$attrs"
    :style="{
      backgroundColor: color,
      color: colors.text,
      borderColor: colors.text,
    }"
  >
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </Dialog>
</template>
