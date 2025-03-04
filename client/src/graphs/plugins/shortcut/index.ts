import { computed, onUnmounted } from 'vue';
import type { BaseGraph } from '@graph/base';
import { useShortcutPressed } from './useShortcutPressed';
import type { GraphHistoryPlugin } from '../history';
import type { GraphFocusPlugin } from '../focus';
import type { GraphAnnotationPlugin } from '../annotations';
import { useToast } from 'primevue/usetoast';

const USER_PLATFORM = window.navigator.userAgent.includes('Mac')
  ? 'Mac'
  : 'Windows';

/**
 * a plugin that allows users to use keyboard shortcuts to interact with the graph
 */
export const useShortcuts = (
  graph: BaseGraph &
    GraphHistoryPlugin &
    GraphFocusPlugin &
    GraphAnnotationPlugin,
) => {
  const { settings } = graph;

  const toast = useToast();

  const defaultShortcutUndo = () => {
    if (graph.annotation.isActive.value) graph.annotation.undo();
    if (settings.value.interactive) {
      const action = graph.history.undo();
      if (!action) return;
      // TODO focus the edges that were affected by move
      // actions as well
      graph.focus.set(action.affectedItems.map((item) => item.data.id));
    }
  };

  const defaultShortcutRedo = () => {
    if (graph.annotation.isActive.value) graph.annotation.redo();
    if (settings.value.interactive) {
      const action = graph.history.redo();
      if (!action) return;
      graph.focus.set(action.affectedItems.map((item) => item.data.id));
    }
  };

  const defaultShortcutEscape = () => graph.focus.reset();
  const defaultShortcutSelectAll = () => graph.focus.all();
  const defaultShortcutDelete = () => {
    if (settings.value.interactive === false) return;
    graph.bulkRemoveNode([...graph.focus.focusedItemIds.value]);
    graph.bulkRemoveEdge([...graph.focus.focusedItemIds.value]);
  };

  const defaultShortcutSave = () => {
    const saveMessages = [
      'Magic Graphs saves for you automagically ⚡',
      'Don’t worry, We’ve been saving while you weren’t looking. 😎',
      'Magic Graphs syncs with your browser automatically. ✨',
      `Pressing ${USER_PLATFORM === 'Mac' ? '⌘' : 'Ctrl'} + S again? Okay, We saved it twice... just kidding! 😂`,
      'Saved automatically — like magic, but better because it’s real. 🌟',
      'Magic Graphs keeps your data saved so you don’t have to worry 😅',
      'Saving? Already done. You’re fast, but we’re faster. 🏃‍♂️💨',
    ];

    toast.add({
      severity: 'secondary',
      life: 3000,
      detail: saveMessages[Math.floor(Math.random() * saveMessages.length)],
    });
  };

  /**
   * get the function to run based on the keyboard shortcut setting
   */
  const getFn = (defaultFn: () => void, setting: boolean | (() => void)) => {
    if (setting === false) return () => {};
    if (typeof setting === 'function') return setting;
    return defaultFn;
  };

  const shortcutRedo = computed(() =>
    getFn(defaultShortcutRedo, settings.value.shortcutRedo),
  );
  const shortcutUndo = computed(() =>
    getFn(defaultShortcutUndo, settings.value.shortcutUndo),
  );
  const shortcutEscape = computed(() =>
    getFn(defaultShortcutEscape, settings.value.shortcutEscape),
  );
  const shortcutSelectAll = computed(() =>
    getFn(defaultShortcutSelectAll, settings.value.shortcutSelectAll),
  );
  const shortcutDelete = computed(() =>
    getFn(defaultShortcutDelete, settings.value.shortcutDelete),
  );
  const shortcutSave = computed(() =>
    getFn(defaultShortcutSave, settings.value.shortcutSave),
  );

  const bindings = computed(() => ({
    Mac: {
      ['Meta+Z']: {
        name: 'Undo',
        shortcut: shortcutUndo.value,
      },
      ['Shift+Meta+Z']: {
        name: 'Redo',
        shortcut: shortcutRedo.value,
      },
      ['Meta+Shift+Z']: {
        name: 'Redo',
        shortcut: shortcutRedo.value,
      },
      ['Backspace']: {
        name: 'Delete',
        shortcut: shortcutDelete.value,
      },
      ['Meta+A']: {
        name: 'Select All',
        shortcut: shortcutSelectAll.value,
      },
      ['Escape']: {
        name: 'Deselect',
        shortcut: shortcutEscape.value,
      },
      ['Meta+S']: {
        name: 'Save',
        shortcut: shortcutSave.value,
      },
    },
    Windows: {
      ['Control+Z']: {
        name: 'Undo',
        shortcut: shortcutUndo.value,
      },
      ['Shift+Control+Z']: {
        name: 'Redo',
        shortcut: shortcutRedo.value,
      },
      ['Control+Shift+Z']: {
        name: 'Redo',
        shortcut: shortcutRedo.value,
      },
      ['Backspace']: {
        name: 'Delete',
        shortcut: shortcutDelete.value,
      },
      ['Delete']: {
        name: 'Delete',
        shortcut: shortcutDelete.value,
      },
      ['Control+A']: {
        name: 'Select All',
        shortcut: shortcutSelectAll.value,
      },
      ['Escape']: {
        name: 'Deselect',
        shortcut: shortcutEscape.value,
      },
      ['Control+S']: {
        name: 'Save',
        shortcut: shortcutSave.value,
      },
    },
  }));

  const nameToBindingKeys = computed(() => {
    const platformBindings = bindings.value[USER_PLATFORM];
    const nameToBindingKeys: Record<string, string> = {};
    for (const key in platformBindings) {
      nameToBindingKeys[
        platformBindings[key as keyof typeof platformBindings].name
      ] = key;
    }
    return nameToBindingKeys;
  });

  const { isPressed } = useShortcutPressed();

  const handleKeyboardEvents = (ev: KeyboardEvent) => {
    if (graph.canvasFocused.value === false) return;
    const binding = bindings.value[USER_PLATFORM];
    for (const key in binding) {
      if (!isPressed(key)) continue;
      binding[key as keyof typeof binding].shortcut();
      ev.preventDefault();
      return;
    }
  };

  const activate = () => {
    graph.subscribe('onKeyDown', handleKeyboardEvents);
  };

  const deactivate = () => {
    graph.unsubscribe('onKeyDown', handleKeyboardEvents);
  };

  if (settings.value.shortcuts) activate();

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.shortcuts === true) activate();
    else if (diff.shortcuts === false) deactivate();
  });

  onUnmounted(() => toast.removeAllGroups());

  return {
    /**
     * a map shortut names and their corresponding bindings in string form based on the platform you are on. Example: { 'Undo', ['Ctrl+Z'] }
     */
    nameToBindingKeys,
    /**
     * functions computed to mirror the actions of the keyboard shortcuts.
     * invoking these are the API equivalent of pressing the keyboard shortcuts
     */
    trigger: {
      delete: shortcutDelete,
      selectAll: shortcutSelectAll,
      escape: shortcutEscape,
      redo: shortcutRedo,
      undo: shortcutUndo,
    },
  };
};
