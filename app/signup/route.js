import { NextResponse } from "next/server";
import { emailSignup } from "../../database/postgresdb";
import bcrypt from 'bcrypt';

export async function POST(request) {
  try{
    //Get Post Request
    const body = await request.json();
    const { username, email, password, first_name, last_name, date_of_birth } = body;

    //Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //SignUp
    const result = await emailSignup(
      username,
      email,
      hashedPassword,
      first_name,
      last_name,
      date_of_birth
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Signup successful", user: result.user },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}