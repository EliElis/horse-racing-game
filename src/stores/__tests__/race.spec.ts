import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRaceStore } from '@/stores/race'
import { useHorsesStore } from '@/stores/horses'
import { ROUNDS, ROUND_SETTINGS, PARTICIPANTS } from '@/constants'

describe('useRaceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const horsesStore = useHorsesStore()
    horsesStore.initializeHorses()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('has correct defaults', () => {
      const store = useRaceStore()
      expect(store.schedule).toEqual([])
      expect(store.isScheduleGenerated).toBe(false)
      expect(store.isRacing).toBe(false)
    })
  })

  describe('generateSchedule', () => {
    it('creates the correct number of rounds', () => {
      const store = useRaceStore()
      store.generateSchedule()
      expect(store.schedule).toHaveLength(ROUNDS)
    })

    it('each round has correct distance from ROUND_SETTINGS', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.schedule.forEach((round, i) => {
        expect(round.distance).toBe(ROUND_SETTINGS[i])
      })
    })

    it('each round has exactly PARTICIPANTS horses', () => {
      const store = useRaceStore()
      store.generateSchedule()
      for (const round of store.schedule) {
        expect(round.horses).toHaveLength(PARTICIPANTS)
      }
    })

    it('sets isScheduleGenerated to true', () => {
      const store = useRaceStore()
      expect(store.isScheduleGenerated).toBe(false)
      store.generateSchedule()
      expect(store.isScheduleGenerated).toBe(true)
    })

    it('resets race state when regenerated mid-race', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      vi.advanceTimersByTime(500)
      store.generateSchedule()
      expect(store.currentRound).toBe(0)
      expect(store.isRacing).toBe(false)
      expect(store.isPaused).toBe(false)
      expect(store.results).toEqual([])
    })
  })

  describe('startRace', () => {
    it('sets isRacing to true', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      expect(store.isRacing).toBe(true)
    })

    it('initializes raceProgress for current round horses', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      const horses = store.schedule[0]!.horses
      for (const horse of horses) {
        expect(store.raceProgress[horse.id]).toBeDefined()
      }
    })

    it('does nothing if all rounds are complete', () => {
      const store = useRaceStore()
      store.generateSchedule()
      for (let i = 0; i < ROUNDS; i++) {
        store.startRace()
        vi.advanceTimersByTime(60000)
      }
      expect(store.isRacing).toBe(false)
      store.startRace()
      expect(store.isRacing).toBe(false)
    })

    it('does not start without a schedule', () => {
      const store = useRaceStore()
      store.startRace()
      expect(store.isRacing).toBe(false)
    })
  })

  describe('pause and resume', () => {
    it('sets isPaused to true and keeps isRacing true', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      store.pauseRace()
      expect(store.isPaused).toBe(true)
      expect(store.isRacing).toBe(true)
    })

    it('startRace after pause unsets isPaused', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      store.pauseRace()
      expect(store.isPaused).toBe(true)
      store.startRace()
      expect(store.isPaused).toBe(false)
    })

    it('horses continue progressing after resume', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      vi.advanceTimersByTime(300)
      store.pauseRace()
      const progressBefore = { ...store.raceProgress }
      vi.advanceTimersByTime(500)
      expect(store.raceProgress).toEqual(progressBefore)
      store.startRace()
      vi.advanceTimersByTime(300)
      const horses = store.schedule[0]!.horses
      const anyAdvanced = horses.some(
        (h) => (store.raceProgress[h.id] ?? 0) > (progressBefore[h.id] ?? 0),
      )
      expect(anyAdvanced).toBe(true)
    })
  })

  describe('resetRace', () => {
    it('clears all state', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      vi.advanceTimersByTime(1000)
      store.resetRace()
      expect(store.schedule).toEqual([])
      expect(store.currentRound).toBe(0)
      expect(store.isRacing).toBe(false)
      expect(store.isPaused).toBe(false)
      expect(store.raceProgress).toEqual({})
      expect(store.results).toEqual([])
      expect(store.isScheduleGenerated).toBe(false)
    })
  })

  describe('race simulation', () => {
    it('updates raceProgress on timer tick', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      vi.advanceTimersByTime(500)
      const horses = store.schedule[0]!.horses
      for (const horse of horses) {
        expect(store.raceProgress[horse.id]).toBeGreaterThan(0)
      }
    })

    it('horse progress does not exceed round distance', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      vi.advanceTimersByTime(60000)
      const distance = store.schedule[0]!.distance
      const horses = store.schedule[0]!.horses
      for (const horse of horses) {
        expect(store.raceProgress[horse.id] ?? 0).toBeLessThanOrEqual(distance)
      }
    })

    it('records results with correct structure when round finishes', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      vi.advanceTimersByTime(60000)
      expect(store.results).toHaveLength(1)
      const result = store.results[0]!
      expect(result.index).toBe(1)
      expect(result.distance).toBe(ROUND_SETTINGS[0])
      expect(result.positions.length).toBeGreaterThan(0)
      for (const pos of result.positions) {
        expect(pos.position).toBeGreaterThanOrEqual(1)
        expect(pos.horse).toBeDefined()
        expect(pos.horse.id).toBeDefined()
      }
    })

    it('moves to next round after finishing', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      vi.advanceTimersByTime(60000)
      expect(store.currentRound).toBe(1)
      expect(store.isRacing).toBe(false)
    })
  })

  describe('currentRoundData', () => {
    it('returns null when no schedule', () => {
      const store = useRaceStore()
      expect(store.currentRoundData).toBeNull()
    })

    it('returns current round data after schedule generation', () => {
      const store = useRaceStore()
      store.generateSchedule()
      expect(store.currentRoundData).toBeDefined()
      expect(store.currentRoundData!.index).toBe(1)
      expect(store.currentRoundData!.distance).toBe(ROUND_SETTINGS[0])
    })
  })

  describe('isRaceComplete', () => {
    it('is false initially', () => {
      const store = useRaceStore()
      expect(store.isRaceComplete).toBe(false)
    })

    it('is false during a race', () => {
      const store = useRaceStore()
      store.generateSchedule()
      store.startRace()
      expect(store.isRaceComplete).toBe(false)
    })

    it('is true when all rounds have been run', () => {
      const store = useRaceStore()
      store.generateSchedule()
      for (let i = 0; i < ROUNDS; i++) {
        store.startRace()
        vi.advanceTimersByTime(60000)
      }
      expect(store.isRaceComplete).toBe(true)
    })
  })
})
