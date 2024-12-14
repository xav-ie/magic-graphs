<script setup lang="ts" generic="TValue, TItem extends { value: TValue, label: string }">
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core'
import GButton from '../button/GButton.vue';

const target = ref(null)

const props = withDefaults(defineProps<{
  items: TItem[],
  initialItemIndex: number
}>(), {
  initialItemIndex: 0,
})

const selectedItem = defineModel<TValue>()
selectedItem.value = props.items[props.initialItemIndex].value
if (selectedItem.value === undefined) throw new Error('invalid initialItemIndex')

const selectedLabel = computed(() => {
  return props.items.find(item => item.value === selectedItem.value)?.label
})

const isMenuOpen = ref(false);

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;

onClickOutside(target, () => isMenuOpen.value = false)

const selectItem = (item: TItem) => {
  selectedItem.value = item.value;
  isMenuOpen.value = false;
};

const isSelected = (item: TItem) => item.value === selectedItem.value;
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
        :key="item.label"
        @click="selectItem(item)"
        :class="[
          'w-[50px]',
          'rounded-full',
          isSelected(item) ? 'opacity-100 ring-white ring-2 ring-inset' : 'opacity-75'
        ]"
      > {{ item.label }} </GButton>
    </div>

    <!-- button -->
    <GButton
      v-else-if="selectedLabel"
      @click="toggleMenu"
      class="w-[50px] rounded-full"
    > {{ selectedLabel }} </GButton>
  </div>
</template>