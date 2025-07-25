import type { z } from 'zod';
import { loginSchema, registerSchema } from '../schemas';
import type { Card } from './cards';


export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;


export interface User {
  id: string;
  name: string;
  email: string;
  cards: Card[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  userId: string;
} 
