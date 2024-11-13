import { onUnmounted, readonly } from "vue"

export const useKeydownMap = (caseSensitive = false) => {

  const SPECIAL_MAPPING: Record<string, string> = {
    'Meta': 'CTRL',
  }

  const getKeyMapping = (e: KeyboardEvent) => {
    const specialKey = SPECIAL_MAPPING[e.key]
    return specialKey ?? (caseSensitive ? e.key : e.key.toUpperCase())
  }

  /**
   * maps the key to the time it was pressed in milliseconds since the epoch
   */
  const keydownMap = new Map<string, number>()

  const trackKeyDown = (e: KeyboardEvent) => {
    const key = getKeyMapping(e)
    keydownMap.set(key, Date.now())
  }

  const trackKeyUp = (e: KeyboardEvent) => {
    const key = getKeyMapping(e)
    keydownMap.delete(key)
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
    const keysInKeyStr = keyStr.split('+')
    const filteredKeys = keysInKeyStr.filter(k => keydownMap.get(k))
    if (keysInKeyStr.length !== filteredKeys.length) return false
    filteredKeys.sort((a, b) => keydownMap.get(a)! - keydownMap.get(b)!)
    return filteredKeys.join('+') === keyStr
  }

  document.addEventListener('keydown', trackKeyDown)
  document.addEventListener('keyup', trackKeyUp)

  onUnmounted(() => {
    document.removeEventListener('keydown', trackKeyDown)
    document.removeEventListener('keyup', trackKeyUp)
  })

  return {
    isPressed,
    keydownMap: readonly(keydownMap)
  }
}