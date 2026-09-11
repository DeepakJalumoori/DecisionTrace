import { z } from "zod";

export const decisionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  owner: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1),
});

export const extractionSchema = z.object({
  decisions: z.array(decisionSchema),
});

export type ExtractionResult = z.infer<typeof extractionSchema>;
