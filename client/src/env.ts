import { z } from 'zod';

export const env = z.object({
  VITE_API_BASE_URL: z
    .string()
    .optional()
    .transform((v) => (v ?? '').trim().replace(/\/$/, ''))
    .superRefine((val, ctx) => {
      if (!val) return;
      try {
        new URL(val);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'VITE_API_BASE_URL must be empty or a valid http(s) URL',
        });
      }
    }),
}).parse(import.meta.env);
