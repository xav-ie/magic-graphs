<script setup lang="ts">
import { ref, computed, withDefaults, toRefs } from 'vue';
import { onClickOutside } from '@vueuse/core'
import GButton from '../button/GButton.vue';

const target = ref(null)

const props = withDefaults(
  defineProps<{
    items: any[],
    modelValue: any,
    optionValue?: string,
    optionLabel?: string,
  }>(),
  {
    optionValue: 'value',
    optionLabel: 'label',
  }
);

const { modelValue, items, optionValue, optionLabel } = toRefs(props);

const isMenuOpen = ref(false);
const selectedItem = ref(modelValue.value);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

onClickOutside(target, () => isMenuOpen.value = false)

const getOptionValue = (item: any) => item[optionValue.value];
const getOptionLabel = (item: any) => item[optionLabel.value];

const selectItem = (item: any) => {
  selectedItem.value = getOptionValue(item);
  isMenuOpen.value = false;
  emit('update:modelValue', selectedItem.value);
};

const isSelected = (item: any) => getOptionValue(item) === selectedItem.value;

const selectedLabel = computed(() => {
  const found = items.value.find((item) => getOptionValue(item) === selectedItem.value);
  return found ? getOptionLabel(found) : 'Select an item';
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div ref="target" class="w-full flex justify-center">
    <!-- spread menu -->
    <div
      v-if="isMenuOpen"
      class="flex gap-2 justify-center "
      style="flex: 1;"
    >
      <GButton
        v-for="item in items"
        :key="getOptionValue(item)"
        @click="selectItem(item)"
        :class="[
          'w-[50px]',
          isSelected(item) ? 'opacity-100 ring-white ring-2 ring-inset' : 'opacity-75'
        ]"
      >
        <slot name="menu-item" :item="item">
          {{ getOptionLabel(item) }}
        </slot>
      </GButton>
    </div>

    <!-- button -->
    <GButton
      v-else
      @click="toggleMenu"
      class="w-[50px]"
    >
      <slot name="button-label">{{ selectedLabel }}</slot>
    </GButton>
  </div>
</template>