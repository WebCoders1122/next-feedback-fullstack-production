import { z } from "zod";

export const verifySchema = z
  .string()
  .length(6, "Verify Token Must be of 6 Characters");
