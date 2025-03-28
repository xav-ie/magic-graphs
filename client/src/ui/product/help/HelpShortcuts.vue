<script setup lang="ts">
  import HelpSection from './HelpSection.vue';
  import { computed } from 'vue';
  import { nonNullGraph as graph } from '@graph/global';
  import HelpShortcutKey from './HelpShortcutKey.vue';

  /**
   * @example 'Control+Shift+Z' -> ['Control', 'Shift', 'Z']
   */
  const getKeysFromKeyBindStr = (keyBindStr: string) =>
    keyBindStr
      .split('+')
      .map((key) => key.trim())
      .filter((key) => key !== '');

  const { activeShortcuts } = graph.value.shortcut;

  const ADDITIONAL_SHORTCUTS = {
    Fullscreen: { binding: 'F' },
    'Pause/Play Simulation': { binding: 'Space' },
    'Simulation Step Forward': { binding: 'rightArrow' },
    'Simulation Step Backward': { binding: 'leftArrow' },
  };

  const shortcuts = computed(() =>
    Object.assign(activeShortcuts, ADDITIONAL_SHORTCUTS),
  );
</script>

<template>
  <HelpSection title="Useful Shortcuts">
    <div class="flex flex-col gap-1">
      <div
        v-for="(shortcut, shortcutName) in shortcuts"
        :key="shortcutName"
        class="flex justify-between items-center"
      >
        {{ shortcutName }}
        <div class="flex">
          <div
            v-for="keyboardKey in getKeysFromKeyBindStr(shortcut.binding)"
            :key="keyboardKey"
          >
            <HelpShortcutKey :keyboard-key="keyboardKey" />
          </div>
        </div>
      </div>
    </div>
  </HelpSection>
</template>
