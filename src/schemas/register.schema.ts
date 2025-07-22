import { z } from "zod";
import { emailSchema, passwordSchema, nameSchema } from "./common.schema";

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string({ required_error: "Confirmação de senha é obrigatória" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"]
});

export type RegisterSchema = z.infer<typeof registerSchema>;
