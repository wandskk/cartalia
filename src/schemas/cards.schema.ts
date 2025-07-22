import { z } from "zod";

export const addCardsSchema = z.object({
  cardIds: z
    .array(z.string().uuid({ message: "ID da carta inválido" }))
    .min(1, { message: "Selecione pelo menos uma carta" })
});

export type AddCardsSchema = z.infer<typeof addCardsSchema>; 
