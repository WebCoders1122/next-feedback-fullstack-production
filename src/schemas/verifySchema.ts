import { z } from "zod";

export const verifySchema = z
  .string()
  .length(6, { message: "Verify Token Must be of 6 Characters" });
