<script setup lang="ts">
import { ref, computed, withDefaults, toRefs } from 'vue';
import { onClickOutside } from '@vueuse/core'
import GButton from '../button/GButton.vue';

const target = ref(null)

const props = withDefaults(
  defineProps<{
    items: any[],
    modelValue: any,
    itemValue?: string,
    itemLabel?: string,
  }>(),
  {
    itemValue: 'value',
    itemLabel: 'label',
  }
);

const { modelValue, items, itemValue, itemLabel } = toRefs(props);

const isMenuOpen = ref(false);
const selectedItem = ref(modelValue.value);

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;

onClickOutside(target, () => isMenuOpen.value = false)

const getItemValue = (item: any) => itemValue.value === undefined ? item : item[itemValue.value];
const getItemLabel = (item: any) => itemValue.value === undefined ? item : item[itemLabel.value];

const selectItem = (item: any) => {
  selectedItem.value = getItemValue(item);
  isMenuOpen.value = false;
  emit('update:modelValue', selectedItem.value);
};

const isSelected = (item: any) => getItemValue(item) === selectedItem.value;

const selectedLabel = computed(() => {
  const found = items.value.find((item) => getItemValue(item) === selectedItem.value);
  return found ? getItemLabel(found) : 'Select an item';
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="w-full flex justify-center">
    <!-- spread menu -->
    <div
      v-if="isMenuOpen"
      ref="target"
      class="flex gap-2 justify-center "
    >
      <GButton
        v-for="item in items"
        :key="getItemValue(item)"
        @click="selectItem(item)"
        :class="[
          'w-[50px]',
          isSelected(item) ? 'opacity-100 ring-white ring-2 ring-inset' : 'opacity-75'
        ]"
      >
        <slot name="menu-item" :item="item">
          {{ getItemLabel(item) }}
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