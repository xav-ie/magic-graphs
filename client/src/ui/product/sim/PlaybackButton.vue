<script setup lang="ts">
import Button from "@ui/Button.vue";
import CIcon from "@ui/core/Icon.vue";

defineProps<{
  icon: string;
}>();
</script>

<template>
  <Button style="border-radius: 40px">
    <c-icon
      size="42"
      class="py-6 px-10"
      :icon="icon"
    />
  </Button>
</template>