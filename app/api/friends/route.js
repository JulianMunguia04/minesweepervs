import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import client from "../../../database/postgresdb";

export async function GET(req) {
  try {
    // Parse cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      // No token, return empty friends list
      return NextResponse.json({ friends: [] }, { status: 200 });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const username = decoded.username;
  if (!username) {
    return NextResponse.json({ error: "Token missing username" }, { status: 401 });
  }

  // Find user_id from username
  const user = await client.query(
    "SELECT id FROM users WHERE username = $1",
    [username]
  );

  if (user.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = user.rows[0].id;

    // Fetch accepted friends
    const query = `
      SELECT friend_id
      FROM friends
      WHERE user_id = $1 AND status = 'accepted'
    `;
    const result = await client.query(query, [userId]);

    const friendIds = result.rows.map((row) => row.friend_id);

    return NextResponse.json({ friends: friendIds }, { status: 200 });

  } catch (err) {
    console.error("❌ Error fetching friends:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
