import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import client from "../../../database/postgresdb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const query = `SELECT * FROM users WHERE username = $1`;
    const result = await client.query(query, [username]);

    
    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const user = result.rows[0];

    if (!user.password) {
      return NextResponse.json({ message: "User has no password set" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    return response;

    } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}