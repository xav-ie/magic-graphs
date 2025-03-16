import { computed, onUnmounted, ref } from 'vue';

export const useShortcutPressed = (caseSensitive = false) => {
  const getKeyMapping = (e: KeyboardEvent) => {
    if (e.key === ' ') return 'Space';
    const isSpecial = e.key.length > 1;
    if (isSpecial) return e.key;
    return caseSensitive ? e.key : e.key.toUpperCase();
  };

  const currentKeyString = ref('');
  const metaKeyPressed = ref(false); // Track if the Meta key is pressed
  const activeMetaKey = ref(false); // Track if Meta key was pressed when another key is down

  const compareString = computed(() => {
    let filter: string;
    return currentKeyString.value
      .split('+')
      .filter((k) => {
        const shouldRemove = k === filter;
        filter = k;
        return !shouldRemove;
      })
      .join('+');
  });

  const trackKeyDown = (e: KeyboardEvent) => {
    // If Meta key is pressed, mark it
    if (e.metaKey) {
      metaKeyPressed.value = true;
    }

    // If any key is pressed while Meta key is held down, log the combination
    if (metaKeyPressed.value) {
      if (currentKeyString.value.length > 0) currentKeyString.value += '+';
      currentKeyString.value += getKeyMapping(e);
      activeMetaKey.value = true;
    }
  };

  const trackKeyUp = (e: KeyboardEvent) => {
    if (metaKeyPressed.value && activeMetaKey.value) {
      // Log the current key combination
      console.log(`Meta key was held, and ${e.key} was released.`);
      currentKeyString.value = '';
      activeMetaKey.value = false;
    }

    // Reset the Meta key state when it's released
    if (e.metaKey) {
      metaKeyPressed.value = false;
    }

    console.log(currentKeyString.value);
  };

  /**
   * check if a key is pressed or a combination of keys is pressed
   *
   * @param keyStr - the key to check if it is pressed or a combination of keys separated by '+'
   * @returns true if the key is pressed or the combination of keys is pressed down
   * @example isPressed('a') // true if 'a' is pressed down
   * @example isPressed('a+b') // true if 'a' and 'b' are pressed down
   */
  const isPressed = (keyStr: string) => compareString.value === keyStr;

  document.addEventListener('keydown', trackKeyDown);
  document.addEventListener('keyup', trackKeyUp);

  onUnmounted(() => {
    document.removeEventListener('keydown', trackKeyDown);
    document.removeEventListener('keyup', trackKeyUp);
  });

  return {
    isPressed,
    currentKeyString,
  };
};
