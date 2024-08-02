import { z } from "zod";

export const anonymusMessageSchema = z.object({
  textAreaValue: z
    .string()
    .min(10, "Minimun Message Length is 10 Characters")
    .max(200, "maximum Message Length is 200 Characters"),
});
