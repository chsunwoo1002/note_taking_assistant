import { z } from "zod";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);
const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
const forgotPasswordSchema = z.object({
  email: emailSchema,
});
const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema,
});

export {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
