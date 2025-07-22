import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, tradeSchema } from '../validation'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('deve validar dados corretos', () => {
      const validData = {
        email: 'test@example.com',
        password: '123456'
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar email inválido', () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123456'
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Email inválido')
      }
    })

    it('deve rejeitar senha muito curta', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123'
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mínimo')
      }
    })

    it('deve rejeitar campos vazios', () => {
      const invalidData = {
        email: '',
        password: ''
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('deve validar dados corretos', () => {
      const validData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '123456'
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar nome muito curto', () => {
      const invalidData = {
        name: 'A',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '123456'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mínimo')
      }
    })

    it('deve rejeitar senhas diferentes', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '654321'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Senhas não coincidem')
      }
    })

    it('deve rejeitar email inválido', () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email',
        password: '123456',
        confirmPassword: '123456'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('tradeSchema', () => {
    it('deve validar dados corretos', () => {
      const validData = {
        cards: [
          { cardId: 'card-1', type: 'OFFERING' },
          { cardId: 'card-2', type: 'RECEIVING' }
        ]
      }

      const result = tradeSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar array vazio', () => {
      const invalidData = {
        cards: []
      }

      const result = tradeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('pelo menos uma carta')
      }
    })

    it('deve rejeitar tipo inválido', () => {
      const invalidData = {
        cards: [
          { cardId: 'card-1', type: 'INVALID' }
        ]
      }

      const result = tradeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('deve rejeitar cardId vazio', () => {
      const invalidData = {
        cards: [
          { cardId: '', type: 'OFFERING' }
        ]
      }

      const result = tradeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('deve exigir pelo menos uma carta oferecendo', () => {
      const invalidData = {
        cards: [
          { cardId: 'card-1', type: 'RECEIVING' }
        ]
      }

      const result = tradeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('pelo menos uma carta oferecendo')
      }
    })

    it('deve exigir pelo menos uma carta recebendo', () => {
      const invalidData = {
        cards: [
          { cardId: 'card-1', type: 'OFFERING' }
        ]
      }

      const result = tradeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('pelo menos uma carta oferecendo e uma recebendo')
      }
    })
  })
}) 