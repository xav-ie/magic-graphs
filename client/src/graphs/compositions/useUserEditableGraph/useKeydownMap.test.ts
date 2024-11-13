import { test, describe, expect } from 'vitest'
import { useKeydownMap } from './useKeydownMap'

describe('useKeydownMap', () => {
  test('should return isPressed function and keydown map', () => {
    const { isPressed, keydownMap } = useKeydownMap()
    expect(isPressed('a')).toBe(false)
    expect(keydownMap.size).toBe(0)
  })

  test('should track keydown and keyup events (non case-sensitive)', () => {
    const { isPressed, keydownMap } = useKeydownMap()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(isPressed('A')).toBe(true)
    expect(keydownMap.size).toBe(1)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
    expect(isPressed('A')).toBe(false)
    expect(keydownMap.size).toBe(0)
  })

  test('should track keydown and keyup events (case-sensitive)', () => {
    const { isPressed, keydownMap } = useKeydownMap(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(isPressed('a')).toBe(true)
    expect(isPressed('A')).toBe(false)
    expect(keydownMap.size).toBe(1)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
    expect(isPressed('a')).toBe(false)
    expect(isPressed('A')).toBe(false)
    expect(keydownMap.size).toBe(0)
  })

  test('should track keydown and keyup events for special keys', () => {
    const { isPressed, keydownMap } = useKeydownMap()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    expect(isPressed('CTRL')).toBe(true)
    expect(keydownMap.size).toBe(1)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Meta' }))
    expect(isPressed('CTRL')).toBe(false)
    expect(keydownMap.size).toBe(0)
  })

  test('should track keydown and keyup events for multiple keys', async () => {
    const { isPressed, keydownMap } = useKeydownMap()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    expect(isPressed('A+B')).toBe(true)
    expect(keydownMap.size).toBe(2)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
    expect(isPressed('A+B')).toBe(false)
    expect(keydownMap.size).toBe(1)
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }))
    expect(isPressed('A+B')).toBe(false)
    expect(keydownMap.size).toBe(0)
  })

  test('should care about the order of keydown events', async () => {
    const { isPressed, keydownMap } = useKeydownMap()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(keydownMap.size).toBe(2)
    expect(isPressed('A+B')).toBe(false)
  })

  test('should care about order and work on control keys', async () => {
    const { isPressed, keydownMap } = useKeydownMap()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(keydownMap.size).toBe(2)
    expect(isPressed('CTRL+A')).toBe(true)
  })

  test('should care about order and work on control keys (case-sensitive)', async () => {
    const { isPressed, keydownMap } = useKeydownMap(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(keydownMap.size).toBe(2)
    expect(isPressed('CTRL+A')).toBe(false)
    expect(isPressed('CTRL+a')).toBe(true)
  })

  test('should care about order and see that they are out of order', async () => {
    const { isPressed, keydownMap } = useKeydownMap()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    expect(keydownMap.size).toBe(2)
    expect(isPressed('CTRL+A')).toBe(false)
  })

  test('should work on crazy length key combinations', async () => {
    const { isPressed, keydownMap } = useKeydownMap()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }))
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }))
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }))
    expect(keydownMap.size).toBe(5)
    expect(isPressed('CTRL+A+B+C+D')).toBe(true)
  })
})