import { z } from "zod";

export const leadSolutions = [
  "ConciliaIA",
  "AuditaFletes",
  "Agentes de IA y software a la medida",
] as const;

export const leadSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre completo.").max(100, "Máximo 100 caracteres."),
  empresa: z.string().trim().min(2, "Escribe el nombre de tu empresa.").max(120, "Máximo 120 caracteres."),
  correo: z.string().trim().email("Escribe un correo válido (ej. nombre@empresa.com o nombre@gmail.com).").max(255, "Máximo 255 caracteres."),
  whatsapp: z.string().trim().min(7, "Escribe un número válido.").max(30, "Máximo 30 caracteres.").regex(/^[+\d\s().-]+$/, "Usa solo números y símbolos telefónicos."),
  solucion: z.enum(leadSolutions, { required_error: "Selecciona una solución." }),
  ventas_mensuales: z.number().nonnegative().finite().nullable().optional(),
  perdida_estimada: z.number().nonnegative().finite().nullable().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;