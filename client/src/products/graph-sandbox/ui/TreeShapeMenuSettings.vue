<script setup lang="ts">
  import { computed } from "vue";
  import { TREE_FORMATION_OPTIONS_DEFAULTS } from "./useTreeShaper";
  import type { AutoTreeControls } from "./useTreeShaper";
  import CPopover from "@ui/core/Popover.vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import InputRange from "@ui/InputRange.vue";
  import CIcon from "@ui/core/Icon.vue";

  const props = defineProps<{
    controls: AutoTreeControls;
  }>();

  const showOffsetXDefaultButton = computed(() => {
    return (
      props.controls.treeOffsetX.value !==
      TREE_FORMATION_OPTIONS_DEFAULTS.xOffset
    );
  });

  const showOffsetYDefaultButton = computed(() => {
    return (
      props.controls.treeOffsetY.value !==
      TREE_FORMATION_OPTIONS_DEFAULTS.yOffset
    );
  });

  const setOffsetXToDefault = () => {
    props.controls.treeOffsetX.value = TREE_FORMATION_OPTIONS_DEFAULTS.xOffset;
    props.controls.debouncedUpdateShape();
  };

  const setOffsetYToDefault = () => {
    props.controls.treeOffsetY.value = TREE_FORMATION_OPTIONS_DEFAULTS.yOffset;
    props.controls.debouncedUpdateShape();
  };
</script>

<template>
  <CPopover :offset="5">
    <template #activator="{ toggle }">
      <GButton @click="toggle">
        <CIcon icon="settings" />
      </GButton>
    </template>

    <GWell class="p-3 flex flex-col gap-4 w-52 rounded-md shadow-lg">
      <div>
        <h2 class="font-bold text-sm">
          Tree Offset X ({{ controls.treeOffsetX.value }})
        </h2>
        <InputRange
          v-model="controls.treeOffsetX.value"
          @update:model-value="controls.debouncedUpdateShape"
          :min="0"
          :max="TREE_FORMATION_OPTIONS_DEFAULTS.xOffset * 2"
          class="w-full"
        />
        <GButton
          v-if="showOffsetXDefaultButton"
          @click="setOffsetXToDefault"
          contrast
          class="text-xs"
        >
          Set To Default
        </GButton>
      </div>
      <div>
        <h2 class="font-bold text-sm">
          Tree Offset Y ({{ controls.treeOffsetY.value }})
        </h2>
        <InputRange
          v-model="controls.treeOffsetY.value"
          @update:model-value="controls.debouncedUpdateShape"
          :min="0"
          :max="TREE_FORMATION_OPTIONS_DEFAULTS.yOffset * 2"
          class="w-full"
        />
        <GButton
          v-if="showOffsetYDefaultButton"
          @click="setOffsetYToDefault"
          contrast
          class="text-xs"
        >
          Set To Default
        </GButton>
      </div>
    </GWell>
  </CPopover>
</template>
