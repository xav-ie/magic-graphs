/**
 * shortcut graph types
 */

/**
 * @example { binding: 'ctrl+z', trigger: triggerUndo }
 *
 */
type Shortcut = {
  binding: string;
  trigger: () => void;
};

/**
 * @example 'Undo': { binding: 'ctrl+z', trigger: triggerUndo }
 */
type PlatformShortcuts = Record<string, Shortcut>;

/**
 * @example {
 *  Mac: 'Undo': { binding: 'meta+z', trigger: triggerUndo },
 *  Windows: 'Undo': { binding: 'ctrl+z', trigger: triggerUndo }
 * }
 */
export type Shortcuts = {
  Mac: PlatformShortcuts;
  Windows: PlatformShortcuts;
};
