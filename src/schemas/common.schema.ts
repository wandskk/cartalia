import { z } from "zod";


export const emailSchema = z
  .string({ required_error: "O e-mail é obrigatório" })
  .email({ message: "E-mail inválido" });

export const passwordSchema = z
  .string({ required_error: "A senha é obrigatória" })
  .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
  .max(50, { message: "A senha deve ter no máximo 50 caracteres" });

export const nameSchema = z
  .string({ required_error: "O nome é obrigatório" })
  .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
  .max(50, { message: "O nome deve ter no máximo 50 caracteres" });

export const uuidSchema = z
  .string()
  .uuid({ message: "ID inválido" });


export function validateEmail(email: string): string | null {
  try {
    emailSchema.parse(email);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "E-mail inválido";
  }
}

export function validatePassword(password: string): string | null {
  try {
    passwordSchema.parse(password);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Senha inválida";
  }
}

export function validateName(name: string): string | null {
  try {
    nameSchema.parse(name);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Nome inválido";
  }
}

export function validateUuid(id: string): string | null {
  try {
    uuidSchema.parse(id);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "ID inválido";
  }
} 
