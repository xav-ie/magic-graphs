<script setup lang="ts">

const model = defineModel<string>()

</script>

<template>
  <input
    v-model="model"
    type="color"
    :class="`p-1 w-10 h-full rounded-md appearance-none`"
  />
</template>
