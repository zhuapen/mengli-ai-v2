import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DsLoading from '@/design-system/components/DsLoading.vue'

describe('DsLoading', () => {
  it('默认显示加载中文案', () => {
    const wrapper = mount(DsLoading)
    expect(wrapper.text()).toContain('加载中...')
  })

  it('text prop 生效', () => {
    const wrapper = mount(DsLoading, {
      props: { text: '正在生成...' },
    })
    expect(wrapper.text()).toContain('正在生成...')
  })

  it('text 为空时不显示文案', () => {
    const wrapper = mount(DsLoading, {
      props: { text: '' },
    })
    expect(wrapper.find('.ds-loading__text').exists()).toBe(false)
  })

  it('size prop 生效', () => {
    const wrapper = mount(DsLoading, {
      props: { size: 'lg' },
    })
    expect(wrapper.find('.ds-loading--lg').exists()).toBe(true)
  })

  it('overlay prop 生效', () => {
    const wrapper = mount(DsLoading, {
      props: { overlay: true },
    })
    expect(wrapper.find('.ds-loading--overlay').exists()).toBe(true)
  })
})
