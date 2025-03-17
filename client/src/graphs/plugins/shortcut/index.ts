import { computed } from 'vue';
import type { BaseGraph } from '@graph/base';
import type { GraphHistoryPlugin } from '../history';
import type { GraphFocusPlugin } from '../focus';
import type { GraphAnnotationPlugin } from '../annotations';
import {
  scale,
  DEFAULT_SCALE_JUMP,
  MIN_SCALE,
  MAX_SCALE,
} from '@utils/components/usePinchToZoom';
import keys from 'ctrl-keys';
import type { Key } from 'ctrl-keys';
import type { KeyBindings } from './types';

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

  const handler = keys();

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

  const setScale = (scaleChange: number) => {
    scale.value = Math.max(
      Math.min(
        Math.round((scale.value + scaleChange) * 1000) / 1000,
        MAX_SCALE,
      ),
      MIN_SCALE,
    );
  };

  // for some reason the zoom in and out functions get called 4 times.
  // this is a temporary fix to make the zoom in and out functions work as expected
  // this issue is likely due to overlaps inside of the ctrl-keys library and the items we are feeding it
  const defaultShortcutZoomIn = () => setScale(DEFAULT_SCALE_JUMP / 4);
  const defaultShortcutZoomOut = () => setScale(-(DEFAULT_SCALE_JUMP / 4));

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
      ['Meta+Z']: {
        name: 'Undo',
        shortcut: shortcutUndo.value,
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
      ['=']: {
        name: 'Zoom In',
        shortcut: shortcutZoomIn.value,
      },
      ['-']: {
        name: 'Zoom Out',
        shortcut: shortcutZoomOut.value,
      },
    },
    Windows: {
      ['Control+Z']: {
        name: 'Undo',
        shortcut: shortcutUndo.value,
      },
      ['Control+Shift+Z']: {
        name: 'Redo',
        shortcut: shortcutRedo.value,
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
      ['=']: {
        name: 'Zoom In',
        shortcut: shortcutZoomIn.value,
      },
      ['-']: {
        name: 'Zoom Out',
        shortcut: shortcutZoomOut.value,
      },
    },
  }));

  /**
   * @description
   * converts the bindings to the format that the ctrl-keys library expects
   */
  const convertToHandlerFormat = (bindings: KeyBindings) => {
    Object.keys(bindings).forEach((platform) => {
      const platformBindings = bindings[platform as keyof KeyBindings];

      Object.keys(platformBindings).forEach((keyCombination) => {
        const binding = platformBindings[keyCombination];

        const formattedKeyCombination = keyCombination
          .replace('Control', 'ctrl')
          .toLowerCase();

        handler.add(formattedKeyCombination as Key, (e) => {
          e?.preventDefault();
          binding.shortcut();
        });
      });
    });
  };

  convertToHandlerFormat(bindings.value);

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

  const activate = () => {
    graph.subscribe('onKeyDown', handler.handle);
  };

  const deactivate = () => {
    graph.unsubscribe('onKeyDown', handler.handle);
  };

  if (settings.value.shortcuts) activate();

  graph.subscribe('onSettingsChange', (diff) => {
    if (diff.shortcuts === true) activate();
    else if (diff.shortcuts === false) deactivate();
  });

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
