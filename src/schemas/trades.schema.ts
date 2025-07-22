import { z } from "zod";

export const createTradeSchema = z.object({
  cards: z
    .array(
      z.object({
        cardId: z.string().uuid({ message: "ID da carta inválido" }),
        type: z.enum(["OFFERING", "RECEIVING"], {
          errorMap: () => ({ message: "Tipo deve ser OFFERING ou RECEIVING" })
        })
      })
    )
    .min(2, { message: "Selecione pelo menos uma carta para oferecer e uma para receber" })
    .refine(
      (data) => {
        const hasOffering = data.some((card) => card.type === "OFFERING");
        const hasReceiving = data.some((card) => card.type === "RECEIVING");
        return hasOffering && hasReceiving;
      },
      {
        message: "Deve ter pelo menos uma carta oferecendo e uma recebendo",
        path: ["cards"]
      }
    )
});

export type CreateTradeSchema = z.infer<typeof createTradeSchema>; 
