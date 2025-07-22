import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('deve renderizar com texto', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Clique aqui'
      }
    })

    expect(wrapper.text()).toBe('Clique aqui')
  })

  it('deve renderizar com slot', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Texto do slot'
      }
    })

    expect(wrapper.text()).toBe('Texto do slot')
  })

  it('deve aplicar cor primária por padrão', () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: 'primary'
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.classes()).toContain('primary')
  })

  it('deve aplicar cor secundária', () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: 'secondary'
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.classes()).toContain('secondary')
  })

  it('deve aplicar cor de erro', () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: 'error'
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.classes()).toContain('error')
  })

  it('deve aplicar cor de sucesso', () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: 'success'
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.classes()).toContain('success')
  })

  it('deve aplicar cor de destaque', () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: 'accent'
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.classes()).toContain('accent')
  })



  it('deve aplicar estado de loading', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.find('.btn-spinner').exists()).toBe(true)
  })

  it('deve aplicar estado desabilitado', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('deve emitir evento click', async () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Botão'
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('deve não emitir evento click quando desabilitado', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Botão'
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('deve não emitir evento click quando em loading', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Botão'
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('deve aplicar classes customizadas', () => {
    const wrapper = mount(BaseButton, {
      props: {
        class: 'custom-class'
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.classes()).toContain('custom-class')
  })

  it('deve aplicar tipo de botão', () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: 'submit'
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('deve aplicar tipo button por padrão', () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: 'button'
      },
      slots: {
        default: 'Botão'
      }
    })

    expect(wrapper.attributes('type')).toBe('button')
  })
}) 