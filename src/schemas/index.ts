// Schemas de autenticação
export { loginSchema, type LoginSchema } from './login.schema';
export { registerSchema, type RegisterSchema } from './register.schema';

// Schemas de cartas
export { addCardsSchema, type AddCardsSchema } from './cards.schema';

// Schemas de trades
export { createTradeSchema, type CreateTradeSchema } from './trades.schema';

// Schemas comuns e funções utilitárias
export {
  emailSchema,
  passwordSchema,
  nameSchema,
  uuidSchema,
  validateEmail,
  validatePassword,
  validateName,
  validateUuid
} from './common.schema';

// Schemas de modais
export * from './modals.schema'; 
