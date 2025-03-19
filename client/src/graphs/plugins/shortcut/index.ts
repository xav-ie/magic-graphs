import { computed } from 'vue';
import type { BaseGraph } from '@graph/base';
import type { GraphHistoryPlugin } from '../history';
import type { GraphFocusPlugin } from '../focus';
import type { GraphAnnotationPlugin } from '../annotations';
import { setScale, DEFAULT_SCALE_JUMP } from '@utils/components/usePinchToZoom';
import keys from 'ctrl-keys';
import type { Key } from 'ctrl-keys';

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

  const ctrlKeysHandler = keys();

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
    if (graph.annotation.isActive.value) {
      graph.annotation.redo();
      return;
    }
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

  // for some reason the zoom in and out functions get called 2 times.
  // this is a temporary fix to make the zoom in and out functions work as expected
  // this issue is likely due to overlaps inside of the ctrl-keys library and the items we are feeding it
  const defaultShortcutZoomIn = () => setScale(DEFAULT_SCALE_JUMP / 2);
  const defaultShortcutZoomOut = () => setScale(-(DEFAULT_SCALE_JUMP / 2));

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
  const shortcutZoomIn = computed(() =>
    getFn(defaultShortcutZoomIn, settings.value.shortcutZoomIn),
  );
  const shortcutZoomOut = computed(() =>
    getFn(defaultShortcutZoomOut, settings.value.shortcutZoomOut),
  );

  const bindings = computed(() => ({
    Mac: {
      Undo: {
        binding: 'meta+z',
        shortcut: shortcutUndo.value,
      },
      Redo: {
        binding: 'meta+shift+z',
        shortcut: shortcutRedo.value,
      },
      Delete: {
        binding: 'backspace',
        shortcut: shortcutDelete.value,
      },
      'Select All': {
        binding: 'meta+a',
        shortcut: shortcutSelectAll.value,
      },
      Deselect: {
        binding: 'escape',
        shortcut: shortcutEscape.value,
      },
      'Zoom In': {
        binding: '=',
        shortcut: shortcutZoomIn.value,
      },
      'Zoom Out': {
        binding: '-',
        shortcut: shortcutZoomOut.value,
      },
    },
    Windows: {
      Undo: {
        binding: 'ctrl+Z',
        shortcut: shortcutUndo.value,
      },
      Redo: {
        binding: 'ctrl+shift+Z',
        shortcut: shortcutRedo.value,
      },
      Delete: {
        binding: 'delete',
        shortcut: shortcutDelete.value,
      },
      'Select All': {
        binding: 'ctrl+a',
        shortcut: shortcutSelectAll.value,
      },
      Deselect: {
        binding: 'escape',
        shortcut: shortcutEscape.value,
      },
      'Zoom In': {
        binding: '=',
        shortcut: shortcutZoomIn.value,
      },
      'Zoom Out': {
        binding: '-',
        shortcut: shortcutZoomOut.value,
      },
    },
  }));

  const bindingValues = Object.values(bindings.value[USER_PLATFORM]);
  for (const keyboardShortcuts of bindingValues) {
    const typedShortcut = keyboardShortcuts.binding as Key;
    ctrlKeysHandler.add(typedShortcut, (e) => {
      e?.preventDefault();
      keyboardShortcuts.shortcut();
    });
  }

  const activate = () => {
    graph.subscribe('onKeyDown', ctrlKeysHandler.handle);
  };

  const deactivate = () => {
    graph.unsubscribe('onKeyDown', ctrlKeysHandler.handle);
  };

  if (settings.value.shortcuts) activate();

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.shortcuts === true) activate();
    else if (diff.shortcuts === false) deactivate();
  });

  return {
    /**
     * a map shorcut names and their corresponding bindings in string form based on the platform you are on. Example: { 'Undo': binding: ['ctrl+z'], shortcut: shortcutUndo }
     */
    platformBindings: bindings.value[USER_PLATFORM],
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
