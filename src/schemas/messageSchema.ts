import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(6, { message: "Message must be at least of 6 characters" })
    .max(200, { message: "Message must no more than 200 characters" }),
  createdAt: z.date(),
});
