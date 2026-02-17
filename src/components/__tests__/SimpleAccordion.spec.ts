import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SimpleAccordion from '@/components/partials/SimpleAccordion.vue'

const items = [
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' },
  { id: 3, title: 'Item 3' },
]

describe('SimpleAccordion', () => {
  it('all items are closed by default when no activeKey', () => {
    const wrapper = mount(SimpleAccordion, {
      props: { items, itemKey: 'id' },
    })
    const bodies = wrapper.findAll('.accordion-body')
    expect(bodies).toHaveLength(3)
    bodies.forEach((body) => {
      expect(body.attributes('style')).toContain('display: none')
    })
  })

  it('opens and highlights the item matching activeKey', () => {
    const wrapper = mount(SimpleAccordion, {
      props: { items, itemKey: 'id', activeKey: 2 },
    })
    const bodies = wrapper.findAll('.accordion-body')
    const headers = wrapper.findAll('.accordion-header')
    expect(bodies[0]!.attributes('style')).toContain('display: none')
    expect(bodies[1]!.attributes('style') ?? '').not.toContain('display: none')
    expect(bodies[2]!.attributes('style')).toContain('display: none')
    expect(headers[0]!.classes()).not.toContain('active')
    expect(headers[1]!.classes()).toContain('active')
    expect(headers[2]!.classes()).not.toContain('active')
  })

  it('toggles item open on click and closed on second click', async () => {
    const wrapper = mount(SimpleAccordion, {
      props: { items, itemKey: 'id' },
    })
    const headers = wrapper.findAll('.accordion-header')
    await headers[0]!.trigger('click')
    expect(headers[0]!.classes()).toContain('open')
    await headers[0]!.trigger('click')
    expect(headers[0]!.classes()).not.toContain('open')
  })
})
