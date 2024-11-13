import { onUnmounted, ref } from "vue"

export const useKeydownMap = (caseSensitive = false) => {

  const getKeyMapping = (e: KeyboardEvent) => {
    if (e.key === ' ') return 'Space'
    const isSpecial = e.key.length > 1
    if (isSpecial) return e.key
    return caseSensitive ? e.key : e.key.toUpperCase()
  }

  const currentKeyString = ref('')

  const trackKeyDown = (e: KeyboardEvent) => {
    if (currentKeyString.value.length > 0) currentKeyString.value += '+'
    currentKeyString.value += getKeyMapping(e)
  }

  const trackKeyUp = () => {
    currentKeyString.value = ''
  }

  /**
   * check if a key is pressed or a combination of keys is pressed
   *
   * @param keyStr - the key to check if it is pressed or a combination of keys separated by '+'
   * @returns true if the key is pressed or the combination of keys is pressed down
   * @example isPressed('a') // true if 'a' is pressed down
   * @example isPressed('a+b') // true if 'a' and 'b' are pressed down
   */
  const isPressed = (keyStr: string) => {
    let filter: string;
    const comparKey = currentKeyString.value.split('+').filter((k) => {
      const shouldRemove = k === filter
      filter = k
      return !shouldRemove
    }).join('+')
    return comparKey === keyStr
  }

  document.addEventListener('keydown', trackKeyDown)
  document.addEventListener('keyup', trackKeyUp)

  onUnmounted(() => {
    document.removeEventListener('keydown', trackKeyDown)
    document.removeEventListener('keyup', trackKeyUp)
  })

  return {
    isPressed,
    currentKeyString,
  }
}