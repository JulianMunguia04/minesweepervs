import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const user = body.user;

  console.log("Google user:", user);


  return NextResponse.json({ message: "User received", user });
}