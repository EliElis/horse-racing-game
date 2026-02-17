import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RunningHorse from '@/components/partials/RunningHorse.vue'

describe('RunningHorse', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not start animation when isRunning is false', () => {
    const setIntervalSpy = vi.spyOn(global, 'setInterval')
    mount(RunningHorse, {
      props: { fillColor: '#E6194B', isRunning: false },
    })
    expect(setIntervalSpy).not.toHaveBeenCalled()
    setIntervalSpy.mockRestore()
  })

  it('starts animation with default speed when isRunning is true', () => {
    const setIntervalSpy = vi.spyOn(global, 'setInterval')
    mount(RunningHorse, {
      props: { fillColor: '#E6194B', isRunning: true },
    })
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 150)
    setIntervalSpy.mockRestore()
  })

  it('uses custom animationSpeed for interval', () => {
    const setIntervalSpy = vi.spyOn(global, 'setInterval')
    mount(RunningHorse, {
      props: { fillColor: '#E6194B', isRunning: true, animationSpeed: 80 },
    })
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 80)
    setIntervalSpy.mockRestore()
  })

  it('clears interval on unmount and when isRunning becomes false', async () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const wrapper = mount(RunningHorse, {
      props: { fillColor: '#E6194B', isRunning: true },
    })
    await wrapper.setProps({ isRunning: false })
    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockReset()
    await wrapper.setProps({ isRunning: true })
    wrapper.unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
