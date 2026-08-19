import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((v) => v || undefined),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export function contactDisplayName(data: Pick<ContactPayload, "firstName" | "lastName">): string {
  return `${data.firstName} ${data.lastName}`.trim();
}
