/**
 * shortcut graph types
 */

export type KeyBinding = {
  name: string;
  shortcut: () => void;
};

export type PlatformBindings = {
  [key: string]: KeyBinding;
};

export type KeyBindings = {
  Mac: PlatformBindings;
  Windows: PlatformBindings;
};
