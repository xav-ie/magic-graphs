/**
 * shortcut graph types
 */

/**
 * @example { name: 'Undo', shortcut: shortcutUndo }
 *
 */
export type KeyBinding = {
  name: string;
  shortcut: () => void;
};

/**
 * @example 'Control+Z': { name: 'Undo', shortcut: shortcutUndo }
 */
export type PlatformBindings = {
  [key: string]: KeyBinding;
};

/**
 * @example {
 *  Mac: { 'Meta+Z': { name: 'Undo', shortcut: shortcutUndo } },
 *  Windows: { 'Control+Z': { name: 'Undo', shortcut: shortcutUndo } }
 * }
 */
export type KeyBindings = {
  Mac: PlatformBindings;
  Windows: PlatformBindings;
};
