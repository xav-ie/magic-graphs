import { computed } from 'vue';
import type { BaseGraph } from '@graph/base';
import type { GraphHistoryPlugin } from '../history';
import type { GraphFocusPlugin } from '../focus';
import type { GraphAnnotationPlugin } from '../annotations';
import { setScale, DEFAULT_SCALE_JUMP } from '@utils/components/usePinchToZoom';
import keys from 'ctrl-keys';
import type { Key } from 'ctrl-keys';
import type { Shortcuts } from './types';

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

  const defaultTriggerUndo = () => {
    if (graph.annotation.isActive.value) graph.annotation.undo();
    if (settings.value.interactive) {
      const action = graph.history.undo();
      if (!action) return;
      // TODO focus the edges that were affected by move
      // actions as well
      graph.focus.set(action.affectedItems.map((item) => item.data.id));
    }
  };

  const defaultTriggerRedo = () => {
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

  const defaultTriggerEscape = () => graph.focus.reset();
  const defaultTriggerSelectAll = () => graph.focus.all();
  const defaultTriggerDelete = () => {
    if (settings.value.interactive === false) return;
    graph.bulkRemoveNode([...graph.focus.focusedItemIds.value]);
    graph.bulkRemoveEdge([...graph.focus.focusedItemIds.value]);
  };

  // for some reason the zoom in and out functions get called 2 times.
  // this is a temporary fix to make the zoom in and out functions work as expected
  // this issue is likely due to overlaps inside of the ctrl-keys library and the items we are feeding it
  const defaultTriggerZoomIn = () => setScale(DEFAULT_SCALE_JUMP / 2);
  const defaultTriggerZoomOut = () => setScale(-(DEFAULT_SCALE_JUMP / 2));

  /**
   * get the function to run based on the keyboard shortcut setting
   */
  const getFn = (defaultFn: () => void, setting: boolean | (() => void)) => {
    if (setting === false) return () => {};
    if (typeof setting === 'function') return setting;
    return defaultFn;
  };

  const triggerRedo = computed(() =>
    getFn(defaultTriggerRedo, settings.value.shortcutRedo),
  );
  const triggerUndo = computed(() =>
    getFn(defaultTriggerUndo, settings.value.shortcutUndo),
  );
  const triggerEscape = computed(() =>
    getFn(defaultTriggerEscape, settings.value.shortcutEscape),
  );
  const triggerSelectAll = computed(() =>
    getFn(defaultTriggerSelectAll, settings.value.shortcutSelectAll),
  );
  const triggerDelete = computed(() =>
    getFn(defaultTriggerDelete, settings.value.shortcutDelete),
  );
  const triggerZoomIn = computed(() =>
    getFn(defaultTriggerZoomIn, settings.value.shortcutZoomIn),
  );
  const triggerZoomOut = computed(() =>
    getFn(defaultTriggerZoomOut, settings.value.shortcutZoomOut),
  );

  const bindings = computed<Shortcuts>(() => ({
    Mac: {
      Undo: {
        binding: 'meta+z',
        trigger: triggerUndo.value,
      },
      Redo: {
        binding: 'meta+shift+z',
        trigger: triggerRedo.value,
      },
      Delete: {
        binding: 'backspace',
        trigger: triggerDelete.value,
      },
      'Select All': {
        binding: 'meta+a',
        trigger: triggerSelectAll.value,
      },
      Deselect: {
        binding: 'escape',
        trigger: triggerEscape.value,
      },
      'Zoom In': {
        binding: '=',
        trigger: triggerZoomIn.value,
      },
      'Zoom Out': {
        binding: '-',
        trigger: triggerZoomOut.value,
      },
    },
    Windows: {
      Undo: {
        binding: 'ctrl+Z',
        trigger: triggerUndo.value,
      },
      Redo: {
        binding: 'ctrl+shift+Z',
        trigger: triggerRedo.value,
      },
      Delete: {
        binding: 'delete',
        trigger: triggerDelete.value,
      },
      'Select All': {
        binding: 'ctrl+a',
        trigger: triggerSelectAll.value,
      },
      Deselect: {
        binding: 'escape',
        trigger: triggerEscape.value,
      },
      'Zoom In': {
        binding: '=',
        trigger: triggerZoomIn.value,
      },
      'Zoom Out': {
        binding: '-',
        trigger: triggerZoomOut.value,
      },
    },
  }));

  // adds the keyboard shortcuts to the ctrlKeysHandler
  const shortcutValues = Object.values(bindings.value[USER_PLATFORM]);
  for (const keyboardShortcut of shortcutValues) {
    const typedBinding = keyboardShortcut.binding as Key;
    ctrlKeysHandler.add(typedBinding, (e) => {
      e?.preventDefault();
      keyboardShortcut.trigger();
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
      delete: triggerDelete,
      selectAll: triggerSelectAll,
      escape: triggerEscape,
      redo: triggerRedo,
      undo: triggerUndo,
    },
  };
};
