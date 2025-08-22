import { NextResponse } from "next/server";
import cookie from "cookie";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Overwrite the cookie with empty value and immediate expiration
  response.headers.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );

  return response;
}