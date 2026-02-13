import { ref } from 'vue'
import { defineStore } from 'pinia'
import { HORSE_NAMES, HORSE_COLORS } from '@/constants'

export interface Horse {
  id: number
  name: string
  color: string
  condition: number
}

const generateCondition = () => Math.floor(Math.random() * 100) + 1

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  let currentIndex = shuffled.length

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex]!, shuffled[currentIndex]!]
  }

  return shuffled
}

export const useHorsesStore = defineStore('horses', () => {
  const horses = ref<Horse[]>([])

  function initializeHorses() {
    const shuffledColors = shuffleArray(HORSE_COLORS)
    horses.value = HORSE_NAMES.map((name, index) => ({
      name,
      color: shuffledColors[index]!,
      id: index + 1,
      condition: generateCondition(),
    }))
  }

  return { horses, initializeHorses }
})
