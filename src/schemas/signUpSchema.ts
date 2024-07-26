import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, { message: "username must at least of 3 characters" })
  .max(15, { message: "username must no more than characters" })
  .regex(/^(?=.{4,16}$)(?!.*[_]{2})[a-zA-Z0-9_]+$/, {
    message: 'username should be Alpha Numaric & can have one underscore "_" ',
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm, {
      message: `- at least 6 characters
    - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
    - Can contain special characters`,
    }),
});
