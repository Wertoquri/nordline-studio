import { z } from 'zod';
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(5).max(100).refine((value) => /[\d@+]/.test(value)),
  projectType: z.enum(['apartment', 'house', 'commercial', 'other']),
  area: z.string().trim().min(1).max(20).refine((value) => /^\d{1,4}(?:[.,]\d)?(?:\s?м²)?$/.test(value)),
  message: z.string().trim().max(1000).optional().default(''),
  website: z.string().max(0).optional(),
  locale: z.enum(['uk', 'en']).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;
