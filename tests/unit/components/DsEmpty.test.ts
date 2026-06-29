import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DsEmpty from '@/design-system/components/DsEmpty.vue'

describe('DsEmpty', () => {
  it('默认显示暂无数据', () => {
    const wrapper = mount(DsEmpty)
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('title prop 生效', () => {
    const wrapper = mount(DsEmpty, {
      props: { title: '暂无素材' },
    })
    expect(wrapper.text()).toContain('暂无素材')
  })

  it('description prop 生效', () => {
    const wrapper = mount(DsEmpty, {
      props: { description: '开始创作后会显示' },
    })
    expect(wrapper.text()).toContain('开始创作后会显示')
  })

  it('showAction=true 且 actionText 时显示按钮', () => {
    const wrapper = mount(DsEmpty, {
      props: { showAction: true, actionText: '去创建' },
    })
    expect(wrapper.find('.ds-empty__action').exists()).toBe(true)
    expect(wrapper.text()).toContain('去创建')
  })

  it('showAction=false 时隐藏按钮', () => {
    const wrapper = mount(DsEmpty, {
      props: { showAction: false, actionText: '去创建' },
    })
    expect(wrapper.find('.ds-empty__action').exists()).toBe(false)
  })

  it('点击 action 按钮 emit action', async () => {
    const wrapper = mount(DsEmpty, {
      props: { showAction: true, actionText: '去创建' },
    })
    await wrapper.find('.ds-empty__action').trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })
})
