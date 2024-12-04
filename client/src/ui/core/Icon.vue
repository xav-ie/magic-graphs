<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
}>()

const isOutlined = computed(() => {
  return props.icon.endsWith('_outline');
})

const iconClass = computed(() => {
  if (isOutlined.value) {
    return 'material-icons-outlined';
  }

  return 'material-icons';
})

const icon = computed(() => {
  // if icon ends with _outline, remove it
  return props.icon.replace(/_outline$/, '');
})
</script>

<template>
  <span :class="iconClass">
    {{ icon }}
  </span>
</template>
