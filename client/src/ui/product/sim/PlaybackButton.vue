<script setup lang="ts">
import Button from "@ui/Button.vue";
import CIcon from "@ui/core/Icon.vue";

defineProps<{
  icon: string;
}>();
</script>

<template>
  <Button style="border-radius: 40px">
    <CIcon
      class="py-1 px-6 text-5xl"
      :icon="icon"
    />
  </Button>
</template>