import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DsError from '@/design-system/components/DsError.vue'

describe('DsError', () => {
  it('默认显示加载失败', () => {
    const wrapper = mount(DsError)
    expect(wrapper.text()).toContain('加载失败')
  })

  it('默认显示默认错误消息', () => {
    const wrapper = mount(DsError)
    expect(wrapper.text()).toContain('请求失败，请稍后重试')
  })

  it('title prop 生效', () => {
    const wrapper = mount(DsError, {
      props: { title: '自定义标题' },
    })
    expect(wrapper.text()).toContain('自定义标题')
  })

  it('message prop 生效', () => {
    const wrapper = mount(DsError, {
      props: { message: '自定义错误消息' },
    })
    expect(wrapper.text()).toContain('自定义错误消息')
  })

  it('showRetry=true 时显示重试按钮', () => {
    const wrapper = mount(DsError, {
      props: { showRetry: true },
    })
    expect(wrapper.find('.ds-error__retry').exists()).toBe(true)
  })

  it('showRetry=false 时隐藏重试按钮', () => {
    const wrapper = mount(DsError, {
      props: { showRetry: false },
    })
    expect(wrapper.find('.ds-error__retry').exists()).toBe(false)
  })

  it('retryText 生效', () => {
    const wrapper = mount(DsError, {
      props: { retryText: '重新加载' },
    })
    expect(wrapper.text()).toContain('重新加载')
  })

  it('点击重试按钮 emit retry', async () => {
    const wrapper = mount(DsError)
    await wrapper.find('.ds-error__retry').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})
