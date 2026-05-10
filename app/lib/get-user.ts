import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("Decoded Token in getUser:", payload);
    return {
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
      avatar: (payload.profileImage as string) || "/avatar.jpg",
    };
  } catch {
    return null;
  }
}