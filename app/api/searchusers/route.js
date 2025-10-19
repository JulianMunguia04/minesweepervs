import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import client from "../../../database/postgresdb";

export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const currentUsername = decoded.username;

    // Get logged-in user ID
    const userRes = await client.query(
      "SELECT id FROM users WHERE username = $1",
      [currentUsername]
    );
    if (userRes.rows.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 });
    const currentUserId = userRes.rows[0].id;

    // Parse search query
    const { query } = await req.json();
    if (!query || query.trim() === "") return NextResponse.json([], { status: 200 });

    // Search users and left join with friends table
    const searchQuery = `
      SELECT u.id, u.username, u.first_name, u.last_name, u.profile_picture,
             f.status AS friend_status
      FROM users u
      LEFT JOIN friends f
        ON (f.user_id = $1 AND f.friend_id = u.id)
      WHERE u.username ILIKE '%' || $2 || '%'
        AND u.id != $1
      LIMIT 5
    `;

    const usersRes = await client.query(searchQuery, [currentUserId, query]);
    const users = usersRes.rows.map(user => {
      let status = null;
      if (user.friend_status === "accepted") status = "friends";
      else if (user.friend_status === "requested") status = "pending";
      // If friend_status is null → keep status = null

      return { ...user, status };
    });

    return NextResponse.json(users);

  } catch (err) {
    console.error("❌ Error in searchusers:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
