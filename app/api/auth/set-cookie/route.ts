import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { accessToken } = await req.json();

  const response = NextResponse.json({ success: true });

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  });

  return response;
}
