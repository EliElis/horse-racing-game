import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RaceTracking from '@/components/RaceTracking.vue'
import { useRaceStore } from '@/stores/race'
import { useHorsesStore } from '@/stores/horses'

describe('RaceTracking', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    const horsesStore = useHorsesStore()
    horsesStore.initializeHorses()
  })

  it('shows 10 placeholder lanes with message when no schedule', () => {
    const wrapper = mount(RaceTracking, {
      global: { plugins: [pinia] },
    })
    expect(wrapper.find('.race-tracking-placeholder').exists()).toBe(true)
    expect(wrapper.text()).toContain('Generate a schedule to start racing')
    const lanes = wrapper.findAll('.race-tracking-placeholder .race-tracking-lane')
    expect(lanes).toHaveLength(10)
  })

  it('shows race lanes after schedule is generated', () => {
    const raceStore = useRaceStore()
    raceStore.generateSchedule()
    const wrapper = mount(RaceTracking, {
      global: { plugins: [pinia] },
    })
    expect(wrapper.find('.race-tracking-placeholder').exists()).toBe(false)
    expect(wrapper.findAll('.race-tracking-lane').length).toBe(10)
  })

  it('shows "Press START" notice before race begins', () => {
    const raceStore = useRaceStore()
    raceStore.generateSchedule()
    const wrapper = mount(RaceTracking, {
      global: { plugins: [pinia] },
    })
    expect(wrapper.text()).toContain('Press START to begin the race')
  })
})
