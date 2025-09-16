import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import client from "../../database/postgresdb";

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;

    if (!token) return NextResponse.json(null, { status: 200 });

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const username = decoded.username;

    // Fetch user from PostgreSQL
    const query = `
      SELECT id, username, email, first_name, last_name, date_of_birth, profile_picture,
             games_played, games_won, elo, avg_points_per_second, created_at
      FROM users
      WHERE username = $1
    `;
    const result = await client.query(query, [username]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];
    return NextResponse.json(user);

  } catch (err) {
    console.error("❌ Error fetching userdata:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
