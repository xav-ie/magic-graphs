<script setup lang="ts">
import { computed } from 'vue';

const model = defineModel<string>()

const colorValue = computed({
  get: () => model.value,
  set: (value: string) => model.value = value
})

const colorAlpha = computed(() => {

})

const handleUpdate = (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) return
  const inputtedColor = e.target.value
}
</script>

<template>
  <input
    @input="handleUpdate"
    :value="colorValue"
    type="color"
    :class="`p-1 w-10 h-full rounded-md appearance-none`"
  />
</template>
