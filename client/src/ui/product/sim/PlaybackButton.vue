<script setup lang="ts">
import Button from "@ui/Button.vue";
</script>

<template>
  <Button style="border-radius: 40px">
    <v-icon
      size="42"
      class="py-6 px-10"
    >
      <slot></slot>
    </v-icon>
  </Button>
</template>