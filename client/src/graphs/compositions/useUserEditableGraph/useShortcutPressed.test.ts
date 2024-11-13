import { test, describe, expect } from 'vitest'
import { useShortcutPressed } from './useShortcutPressed'

describe('useKeydownMap', () => {
  test('should return isPressed function and keydown map', () => {
    const { isPressed } = useShortcutPressed()
    expect(isPressed('a')).toBe(false)
  })

  test('should track keydown and keyup events (non case-sensitive)', () => {
    const { isPressed } = useShortcutPressed()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(isPressed('A')).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
    expect(isPressed('A')).toBe(false)
  })

  test('should track keydown and keyup events (case-sensitive)', () => {
    const { isPressed } = useShortcutPressed(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(isPressed('a')).toBe(true)
    expect(isPressed('A')).toBe(false)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
    expect(isPressed('a')).toBe(false)
    expect(isPressed('A')).toBe(false)
  })

  test('should track keydown and keyup events for special keys', () => {
    const { isPressed } = useShortcutPressed()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    expect(isPressed('Meta')).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Meta' }))
    expect(isPressed('Meta')).toBe(false)
  })

  test('should track keydown and keyup events for multiple keys', () => {
    const { isPressed } = useShortcutPressed()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    expect(isPressed('A+B')).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
    expect(isPressed('A+B')).toBe(false)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }))
    expect(isPressed('A+B')).toBe(false)
  })

  test('should care about the order of keydown events', () => {
    const { isPressed } = useShortcutPressed()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(isPressed('A+B')).toBe(false)
  })

  test('should care about order and work on control keys', () => {
    const { isPressed } = useShortcutPressed()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(isPressed('Meta+A')).toBe(true)
  })

  test('should care about order and work on control keys (case-sensitive)', () => {
    const { isPressed } = useShortcutPressed(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(isPressed('Meta+A')).toBe(false)
    expect(isPressed('Meta+a')).toBe(true)
  })

  test('should care about order and see that they are out of order', () => {
    const { isPressed } = useShortcutPressed()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    expect(isPressed('Meta+A')).toBe(false)
  })

  test('should work on crazy length key combinations', () => {
    const { isPressed } = useShortcutPressed()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }))
    expect(isPressed('Meta+A+B+C+D')).toBe(true)
  })

  test('spam undo', () => {
    const { isPressed } = useShortcutPressed()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))
    expect(isPressed('Meta+Z')).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))
    expect(isPressed('Meta+Z')).toBe(true)
  })
})