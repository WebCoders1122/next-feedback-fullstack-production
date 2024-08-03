import { z } from "zod";

export const verifySchema = z.object({
  Code: z
    .string()
    .length(6, { message: "Verify Code Must be of 6 Characters" }),
});
