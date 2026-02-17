import { describe, it, expect } from 'vitest'
import { shuffleArray } from '@/utils/array'

describe('shuffleArray', () => {
  it('returns the same elements in any order', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffleArray(input)
    expect(result).toHaveLength(input.length)
    expect(result.sort()).toEqual([...input].sort())
  })

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5]
    const copy = [...input]
    shuffleArray(input)
    expect(input).toEqual(copy)
  })

  it('handles an empty array', () => {
    expect(shuffleArray([])).toEqual([])
  })

  it('handles a single-element array', () => {
    expect(shuffleArray([42])).toEqual([42])
  })

})
