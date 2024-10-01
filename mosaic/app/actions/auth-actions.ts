"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APP_URL } from "@/utils/constants";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/utils/schema";

export const signUpAction = async (formData: FormData) => {
  const signUpData = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!signUpData.success) {
    return encodedRedirect("error", "/sign-up", signUpData.error.message);
  }

  const supabase = createClient();
  const origin = headers().get("origin");

  const { error } = await supabase.auth.signUp({
    email: signUpData.data.email,
    password: signUpData.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link."
  );
};

export const signInAction = async (formData: FormData) => {
  const signInData = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!signInData.success) {
    return encodedRedirect("error", "/sign-in", signInData.error.message);
  }
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: signInData.data.email,
    password: signInData.data.password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const signInWithGoogleAction = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${APP_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const forgotPasswordData = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!forgotPasswordData.success) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      forgotPasswordData.error.message
    );
  }

  const supabase = createClient();
  const origin = headers().get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(
    forgotPasswordData.data.email,
    {
      redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
    }
  );

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const resetPasswordData = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!resetPasswordData.success) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      resetPasswordData.error.message
    );
  }

  if (
    resetPasswordData.data.password !== resetPasswordData.data.confirmPassword
  ) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: resetPasswordData.data.password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed"
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard/reset-password",
    "Password updated"
  );
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
