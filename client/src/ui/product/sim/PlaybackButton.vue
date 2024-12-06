<script setup lang="ts">
import CButton from "@ui/core/button/Button.vue";
import CIcon from "@ui/core/Icon.vue";

defineProps<{
  icon: string;
}>();
</script>

<template>
  <CButton style="border-radius: 40px">
    <CIcon
      class="py-1 px-6 text-5xl"
      :icon="icon"
    />
  </CButton>
</template>