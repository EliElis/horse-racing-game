import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHorsesStore } from '@/stores/horses'

describe('useHorsesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with an empty horses array', () => {
    const store = useHorsesStore()
    expect(store.horses).toEqual([])
  })

  it('initializeHorses creates 20 horses', () => {
    const store = useHorsesStore()
    store.initializeHorses()
    expect(store.horses).toHaveLength(20)
  })

  it('each horse has a unique id from 1 to 20', () => {
    const store = useHorsesStore()
    store.initializeHorses()
    const ids = store.horses.map((h) => h.id)
    expect(new Set(ids).size).toBe(20)
    for (const id of ids) {
      expect(id).toBeGreaterThanOrEqual(1)
      expect(id).toBeLessThanOrEqual(20)
    }
  })

  it('each horse has valid and unique properties', () => {
    const store = useHorsesStore()
    store.initializeHorses()
    const names = new Set<string>()
    const colors = new Set<string>()
    for (const horse of store.horses) {
      expect(horse.name).toBeTruthy()
      expect(horse.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(horse.colorName).toBeTruthy()
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
      names.add(horse.name)
      colors.add(horse.color)
    }
    expect(names.size).toBe(20)
    expect(colors.size).toBe(20)
  })

  it('reinitialize produces new conditions', () => {
    const store = useHorsesStore()
    store.initializeHorses()
    const firstConditions = store.horses.map((h) => h.condition)
    store.initializeHorses()
    const secondConditions = store.horses.map((h) => h.condition)
    const anyChanged = firstConditions.some((c, i) => c !== secondConditions[i])
    expect(anyChanged).toBe(true)
  })
})
