import { z } from "zod";

export const acceptinMessageSchema = z.object({
  acceptMessages: z.boolean(),
});
