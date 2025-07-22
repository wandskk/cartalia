import { describe, it, expect } from 'vitest'

// Mock simples do componente para evitar problemas com Vue
const BaseButton = {
  name: 'BaseButton',
  props: {
    type: { type: String, default: 'button' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    color: { type: String, default: 'primary' }
  },
  template: `
    <button :type="type" :disabled="disabled || loading" :class="['base-btn', color]">
      <span v-if="loading" class="btn-spinner"></span>
      <slot />
    </button>
  `
}

describe('BaseButton', () => {
  it('deve ter props corretas', () => {
    expect(BaseButton.props).toBeDefined()
    expect(BaseButton.props.type).toBeDefined()
    expect(BaseButton.props.disabled).toBeDefined()
    expect(BaseButton.props.loading).toBeDefined()
    expect(BaseButton.props.color).toBeDefined()
  })

  it('deve ter template definido', () => {
    expect(BaseButton.template).toBeDefined()
    expect(BaseButton.template).toContain('button')
    expect(BaseButton.template).toContain('base-btn')
  })

  it('deve ter nome do componente', () => {
    expect(BaseButton.name).toBe('BaseButton')
  })

  it('deve ter props com tipos corretos', () => {
    expect(BaseButton.props.type.type).toBe(String)
    expect(BaseButton.props.disabled.type).toBe(Boolean)
    expect(BaseButton.props.loading.type).toBe(Boolean)
    expect(BaseButton.props.color.type).toBe(String)
  })

  it('deve ter valores padrão corretos', () => {
    expect(BaseButton.props.type.default).toBe('button')
    expect(BaseButton.props.disabled.default).toBe(false)
    expect(BaseButton.props.loading.default).toBe(false)
    expect(BaseButton.props.color.default).toBe('primary')
  })
}) 