<script setup lang="ts">
import { computed } from 'vue';
import { isHexAlpha } from '@utils/colors';

const model = defineModel<string>()

const colorValue = computed({
  get: () => model.value,
  set: (value: string) => model.value = value
})

const colorAlpha = computed(() => {
  if (!colorValue.value) return ''
  if (isHexAlpha(colorValue.value)) return colorValue.value.slice(6)
  return ''
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
