<script setup lang="ts">
  import { ref } from "vue";
  import Popover from "primevue/popover";

  const op = ref();

  const toggle = (ev: MouseEvent) => {
    op.value.toggle(ev);
  };

  const isOpen = ref(false);
</script>

<template>
  <slot
    name="activator"
    :toggle="toggle"
    :isOpen="isOpen"
  ></slot>
  <Popover
    unstyled
    ref="op"
    @show="isOpen = true"
    @hide="isOpen = false"
  >
    <slot
      name="content"
      :isOpen="isOpen"
    ></slot>
  </Popover>
</template>
