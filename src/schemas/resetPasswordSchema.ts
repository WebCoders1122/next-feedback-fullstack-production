import { z } from "zod";

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm, {
      message: `- at least 6 characters
    - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
    - Can contain special characters`,
    }),
  verify_password: z.string().min(6),
});
