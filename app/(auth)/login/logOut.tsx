"use server";

import { cookies } from "next/headers";

export const logOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};