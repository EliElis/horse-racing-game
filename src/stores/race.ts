import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { PARTICIPANTS, ROUNDS, ROUND_SETTINGS } from '@/constants'
import { useHorsesStore, type Horse } from '@/stores/horses'
import { shuffleArray } from '@/utils/array'

interface RoundData {
  index: number
  distance: number
  horses: Horse[]
}

interface RoundResult {
  index: number
  distance: number
  positions: { position: number; horse: Horse }[]
}

function selectRandomHorses(horses: Horse[]): Horse[] {
  return shuffleArray(horses).slice(0, PARTICIPANTS)
}

export const useRaceStore = defineStore('race', () => {
  const schedule = ref<RoundData[]>([])
  const currentRound = ref(0)
  const isRacing = ref(false)
  const isPaused = ref(false)
  const raceProgress = ref<Record<number, number>>({})
  const finishOrder = ref<Horse[]>([])
  const results = ref<RoundResult[]>([])
  const isScheduleGenerated = ref(false)
  let simulationInterval: ReturnType<typeof setInterval> | null = null

  const currentRoundData = computed(() => schedule.value[currentRound.value] ?? null)
  const isRaceComplete = computed(() => currentRound.value >= ROUNDS && !isRacing.value)

  function generateSchedule() {
    const horsesStore = useHorsesStore()

    schedule.value = ROUND_SETTINGS.map((distance, index) => ({
      index: index + 1,
      distance,
      horses: selectRandomHorses(horsesStore.horses),
    }))

    currentRound.value = 0
    raceProgress.value = {}
    finishOrder.value = []
    isRacing.value = false
    isPaused.value = false
    results.value = []
    isScheduleGenerated.value = true
  }

  function startRace() {
    if (currentRound.value >= ROUNDS) return

    if (isPaused.value) {
      isPaused.value = false
      return
    }

    isRacing.value = true
    isPaused.value = false

    const round = schedule.value[currentRound.value]
    if (round) {
      const initialProgress: Record<number, number> = {}
      round.horses.forEach((horse) => {
        initialProgress[horse.id] = 0
      })
      raceProgress.value = initialProgress
      finishOrder.value = []
      startSimulation()
    }
  }

  function startSimulation() {
    stopSimulation()
    simulationInterval = setInterval(() => {
      if (isPaused.value) return

      const round = schedule.value[currentRound.value]
      if (!round) return

      let allFinished = true
      round.horses.forEach((horse) => {
        const current = raceProgress.value[horse.id] ?? 0
        if (current >= round.distance) return
        allFinished = false
        const baseSpeed = 20
        const conditionBonus = (horse.condition / 100) * 10
        const randomFactor = Math.random() * 5
        const step = baseSpeed + conditionBonus + randomFactor
        const next = Math.min(current + step, round.distance)
        raceProgress.value[horse.id] = next
        if (next >= round.distance && !finishOrder.value.includes(horse)) {
          finishOrder.value.push(horse)
        }
      })

      if (allFinished) {
        finishRound()
      }
    }, 100)
  }

  function stopSimulation() {
    if (simulationInterval) {
      clearInterval(simulationInterval)
      simulationInterval = null
    }
  }

  function pauseRace() {
    isPaused.value = true
  }

  function finishRound() {
    stopSimulation()
    const round = schedule.value[currentRound.value]

    if (round) {
      results.value.push({
        index: currentRound.value + 1,
        distance: round.distance,
        positions: finishOrder.value.map((horse, index) => ({
          position: index + 1,
          horse,
        })),
      })
    }

    isRacing.value = false
    currentRound.value++
    raceProgress.value = {}
  }

  function resetRace() {
    stopSimulation()
    schedule.value = []
    currentRound.value = 0
    isRacing.value = false
    isPaused.value = false
    raceProgress.value = {}
    finishOrder.value = []
    results.value = []
    isScheduleGenerated.value = false
  }

  return {
    schedule,
    currentRound,
    isRacing,
    isPaused,
    raceProgress,
    results,
    isScheduleGenerated,
    currentRoundData,
    isRaceComplete,
    generateSchedule,
    startRace,
    pauseRace,
    resetRace,
  }
})
