<script setup lang="ts">
import { computed } from 'vue';
import { isHexAlpha, isHexStandard } from '@utils/colors';

const model = defineModel<string>()

const colorValue = computed({
  get: () => model.value,
  set: (value: string) => model.value = value
})

/**
 * isolates the alpha channel from the color (if it exists)
 */
const colorAlpha = computed(() => {
  if (!colorValue.value) return ''
  if (isHexAlpha(colorValue.value)) return colorValue.value.slice(7)
  return ''
})

/**
 * if we cannot get a color the html color input wants, we appease it with this
 */
const STAND_IN_COLOR = '#000000'

/**
 * returns a color that complies with the html color input
 */
const colorValueWithoutAlpha = computed(() => {
  if (!colorValue.value) return STAND_IN_COLOR
  else if (isHexAlpha(colorValue.value)) return colorValue.value.slice(0, 7)
  else if (isHexStandard(colorValue.value)) return colorValue.value
  return STAND_IN_COLOR
})

/**
 * parses the color with the alpha channel back into the model
 */
const handleUpdate = (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) return
  console.log('e.target.value', e.target.value, 'colorAlpha.value', colorAlpha.value)
  colorValue.value = e.target.value + colorAlpha.value
}
</script>

<template>
  <input
    @input="handleUpdate"
    :value="colorValueWithoutAlpha"
    type="color"
    :class="`p-1 w-10 h-full rounded-md appearance-none`"
  />
</template>
