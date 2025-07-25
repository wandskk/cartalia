import { z } from "zod";

/**
 * Schemas de validação para modais e formulários
 */

export const confirmationSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, {
    message: "Confirmação é obrigatória",
  }),
  reason: z.string().optional(),
});

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Busca não pode estar vazia")
    .max(100, "Busca muito longa")
    .optional(),
  filters: z.record(z.any()).optional(),
});

export const selectionSchema = z.object({
  selectedItems: z
    .array(z.string().uuid())
    .min(1, "Selecione pelo menos um item")
    .max(50, "Máximo de 50 itens selecionados"),
  selectAll: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1, "Página deve ser maior que 0"),
  itemsPerPage: z
    .number()
    .int()
    .min(1, "Itens por página deve ser maior que 0")
    .max(100, "Máximo 100 itens por página"),
  totalItems: z
    .number()
    .int()
    .min(0, "Total de itens não pode ser negativo")
    .optional(),
});

export const filterSchema = z.object({
  filters: z
    .record(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.string()),
        z.array(z.number()),
      ])
    )
    .optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const modalFormSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Título muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  fields: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum([
          "text",
          "email",
          "number",
          "select",
          "multiselect",
          "date",
        ]),
        required: z.boolean().optional(),
        validation: z.any().optional(),
      })
    )
    .optional(),
});

export const fileUploadSchema = z.object({
  files: z
    .array(
      z.object({
        name: z.string(),
        size: z
          .number()
          .max(10 * 1024 * 1024, "Arquivo muito grande (máximo 10MB)"),
        type: z.string().regex(/^image\//, "Apenas imagens são permitidas"),
      })
    )
    .max(5, "Máximo 5 arquivos"),
});

export const modalConfigSchema = z.object({
  size: z.enum(["sm", "md", "lg", "xl"]).default("md"),
  persistent: z.boolean().default(false),
  closeOnOverlay: z.boolean().default(true),
  showCloseButton: z.boolean().default(true),
  autoClose: z.boolean().default(false),
  closeDelay: z.number().min(0).max(10000).optional(),
});

export const loadingStateSchema = z.object({
  isLoading: z.boolean(),
  message: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  indeterminate: z.boolean().default(true),
});

export const errorStateSchema = z.object({
  hasError: z.boolean(),
  message: z.string().optional(),
  details: z.string().optional(),
  retryable: z.boolean().default(true),
  errorCode: z.string().optional(),
});

export const notificationSchema = z.object({
  message: z
    .string()
    .min(1, "Mensagem é obrigatória")
    .max(500, "Mensagem muito longa"),
  type: z.enum(["success", "error", "warning", "info"]).default("info"),
  duration: z.number().min(1000).max(10000).default(5000),
  persistent: z.boolean().default(false),
  actionText: z.string().optional(),
  actionUrl: z.string().url().optional(),
});

export const dynamicFormSchema = z.object({
  fields: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      label: z.string(),
      type: z.enum([
        "text",
        "email",
        "password",
        "number",
        "select",
        "textarea",
        "checkbox",
        "radio",
      ]),
      required: z.boolean().default(false),
      placeholder: z.string().optional(),
      options: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          })
        )
        .optional(),
      validation: z
        .object({
          minLength: z.number().optional(),
          maxLength: z.number().optional(),
          pattern: z.string().optional(),
          min: z.number().optional(),
          max: z.number().optional(),
        })
        .optional(),
    })
  ),
  values: z.record(z.any()),
});

export type ConfirmationSchema = z.infer<typeof confirmationSchema>;
export type SearchSchema = z.infer<typeof searchSchema>;
export type SelectionSchema = z.infer<typeof selectionSchema>;
export type PaginationSchema = z.infer<typeof paginationSchema>;
export type FilterSchema = z.infer<typeof filterSchema>;
export type ModalFormSchema = z.infer<typeof modalFormSchema>;
export type FileUploadSchema = z.infer<typeof fileUploadSchema>;
export type ModalConfigSchema = z.infer<typeof modalConfigSchema>;
export type LoadingStateSchema = z.infer<typeof loadingStateSchema>;
export type ErrorStateSchema = z.infer<typeof errorStateSchema>;
export type NotificationSchema = z.infer<typeof notificationSchema>;
export type DynamicFormSchema = z.infer<typeof dynamicFormSchema>;
