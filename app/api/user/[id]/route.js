import { NextResponse } from "next/server";
import client from "../../../../database/postgresdb";

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const query = `
      SELECT id, username, first_name, last_name, profile_picture,
             games_played, games_won, elo, avg_points_per_second, created_at
      FROM users
      WHERE id = $1
    `;

    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    return NextResponse.json(user);

  } catch (err) {
    console.error("❌ Error fetching user by ID:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}