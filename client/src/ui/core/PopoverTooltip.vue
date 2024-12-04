<script setup lang="ts">
  import Popover from "./Popover.vue";
</script>

<template>
  <Popover>
    <template #activator="{ toggle }">
      <div
        @mouseenter="toggle"
        @mouseleave="toggle"
      >
        <slot><!-- optional fallback --></slot>
      </div>
    </template>
    <slot name="content"></slot>
  </Popover>
</template>
