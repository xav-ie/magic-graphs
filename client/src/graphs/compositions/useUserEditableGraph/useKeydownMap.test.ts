import { test, describe, expect } from 'vitest'
import { useKeydownMap } from './useKeydownMap'

describe('useKeydownMap', () => {
  test('should return isPressed function', () => {
    const { isPressed } = useKeydownMap()
    expect(isPressed('a')).toBe(false)
  })
})