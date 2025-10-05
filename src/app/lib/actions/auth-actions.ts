"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export const signUp = async (
  name: string,
  email: string,
  password: string,
  age: number,
  isAdmin: boolean = false // Default to false
) => {
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      age, // Just name, email, password, age
      isAdmin,
      callbackURL: "/home",
    },
  });

  return result;
};

export const signIn = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: "/home",
    },
  });

  return result;
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};
