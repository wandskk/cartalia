import { loginSchema } from "./login.schema";
import { z } from "zod";

export const registerSchema = loginSchema.extend({
  name: z
    .string({ required_error: "O nome é obrigatório" })
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
