import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import client from "../../../../database/postgresdb";

export async function POST(req) {
  try {
    const { user } = await req.json(); // user from Google
    if (!user?.sub || !user?.email) {
      return NextResponse.json({ message: "Invalid Google user data" }, { status: 400 });
    }

    const google_id = user.sub;
    const email = user.email;
    const first_name = user.given_name || null;
    const last_name = user.family_name || null;
    const picture = user.picture || null;

    // 1️⃣ Check if user exists with google_id
    const existingGoogleUser = await client.query(
      "SELECT * FROM users WHERE google_id = $1",
      [google_id]
    );

    if (existingGoogleUser.rows.length > 0) {
      const dbUser = existingGoogleUser.rows[0];
      return sendJwtCookie(dbUser);
    }

    // 2️⃣ Check if user exists with same email (normal signup)
    const existingEmailUser = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingEmailUser.rows.length > 0) {
      const dbUser = existingEmailUser.rows[0];
      // Link google_id to this account
      const updated = await client.query(
        `UPDATE users
         SET google_id = $1, profile_picture = $2, first_name = $3, last_name = $4
         WHERE email = $5
         RETURNING *`,
        [google_id, picture, first_name, last_name, email]
      );
      return sendJwtCookie(updated.rows[0]);
    }

    // 3️⃣ New user -> create
    let baseUsername = email.split("@")[0];
    let username = baseUsername;
    let count = 0;

    while (true) {
      const check = await client.query("SELECT id FROM users WHERE username = $1", [username]);
      if (check.rows.length === 0) break;
      count++;
      username = `${baseUsername}${count}`;
    }

    const insertQuery = `
      INSERT INTO users
      (google_id, username, email, password, first_name, last_name, profile_picture)
      VALUES ($1, $2, $3, NULL, $4, $5, $6)
      RETURNING *
    `;
    const result = await client.query(insertQuery, [
      google_id, username, email, first_name, last_name, picture
    ]);

    return sendJwtCookie(result.rows[0]);

  } catch (err) {
    console.error("❌ Google login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Helper to create JWT and send httpOnly cookie
function sendJwtCookie(user) {
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
}