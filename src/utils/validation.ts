import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

export const tradeSchema = z.object({
  cards: z.array(z.object({
    cardId: z.string().min(1, 'ID da carta é obrigatório'),
    type: z.enum(['OFFERING', 'RECEIVING'])
  })).min(1, 'Deve ter pelo menos uma carta')
}).refine((data) => {
  const hasOffering = data.cards.some(card => card.type === 'OFFERING')
  const hasReceiving = data.cards.some(card => card.type === 'RECEIVING')
  return hasOffering && hasReceiving
}, {
  message: 'Deve ter pelo menos uma carta oferecendo e uma recebendo',
  path: ['cards']
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type TradeForm = z.infer<typeof tradeSchema> 