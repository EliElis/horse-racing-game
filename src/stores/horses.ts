import { ref } from 'vue'
import { defineStore } from 'pinia'
import { HORSE_NAMES, HORSE_COLORS } from '@/constants'
import { shuffleArray } from '@/utils/array'

export interface Horse {
  id: number
  name: string
  color: string
  condition: number
}

const generateCondition = () => Math.floor(Math.random() * 100) + 1

export const useHorsesStore = defineStore('horses', () => {
  const horses = ref<Horse[]>([])

  function initializeHorses() {
    const shuffledNames = shuffleArray(HORSE_NAMES)
    const shuffledColors = shuffleArray(HORSE_COLORS)
    horses.value = shuffledNames.map((name, index) => ({
      name,
      color: shuffledColors[index]!.color,
      id: index + 1,
      condition: generateCondition(),
    }))
  }

  return { horses, initializeHorses }
})
