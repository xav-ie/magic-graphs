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

  const { nameToBindingKeys } = graph.value.shortcut;

  const keybindings = computed<Record<string, string>>(() => ({
    ...nameToBindingKeys.value,
    Fullscreen: 'F',
    'Pause/Play Simulation': 'Space',
    'Simulation Step Forward': 'mdi-arrow-right',
    'Simulation Step Backward': 'mdi-arrow-left',
  }));
</script>

<template>
  <HelpSection title="Useful Shortcuts">
    <div
      v-for="(shortcutKeyboardKeys, shortcutName) in keybindings"
      :key="shortcutName"
      class="flex justify-between items-center"
    >
      {{ shortcutName }}
      <div class="flex">
        <div
          v-for="keyboardKey in getKeysFromKeyBindStr(shortcutKeyboardKeys)"
          :key="keyboardKey"
        >
          <HelpShortcutKey :keyboard-key="keyboardKey" />
        </div>
      </div>
    </div>
  </HelpSection>
</template>
