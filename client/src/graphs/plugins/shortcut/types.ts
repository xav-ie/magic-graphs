/**
 * shortcut graph types
 */

/**
 * @example { binding: 'ctrl+z', shortcut: shortcutUndo }
 *
 */
type KeyBinding = {
  binding: string;
  shortcut: () => void;
};

/**
 * @example 'Undo': { binding: 'ctrl+z', shortcut: shortcutUndo }
 */
type PlatformBindings = {
  [name: string]: KeyBinding;
};

/**
 * @example {
 *  Mac: 'Undo': { binding: 'meta+z', shortcut: shortcutUndo },
 *  Windows: 'Undo': { binding: 'ctrl+z', shortcut: shortcutUndo }
 * }
 */
export type KeyBindings = {
  Mac: PlatformBindings;
  Windows: PlatformBindings;
};
