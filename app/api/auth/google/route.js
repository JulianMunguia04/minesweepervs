import { NextResponse } from "next/server";
import { googleSignup } from "../../../../database/postgresdb";

export async function POST(req) {
  try {
    const body = await req.json();
    const user = body.user;

    const result = await googleSignup(user)

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Google Signup successful", user: result.user },
      { status: 201 }
    );
  }catch(err){
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}