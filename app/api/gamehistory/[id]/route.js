import { NextResponse } from "next/server";
import client from "../../../../database/postgresdb";

export async function GET(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const query = `
      SELECT 
        g.*,
        json_build_object(
          'id', u1.id,
          'username', u1.username,
          'first_name', u1.first_name,
          'last_name', u1.last_name,
          'profile_picture', u1.profile_picture,
          'elo', u1.elo
        ) AS player1_info,
        json_build_object(
          'id', u2.id,
          'username', u2.username,
          'first_name', u2.first_name,
          'last_name', u2.last_name,
          'profile_picture', u2.profile_picture,
          'elo', u2.elo
        ) AS player2_info
      FROM games g
      LEFT JOIN users u1 ON g.player1 = u1.id
      LEFT JOIN users u2 ON g.player2 = u2.id
      WHERE g.player1 = $1 OR g.player2 = $1
      ORDER BY g.created_at DESC;
    `;

    const result = await client.query(query, [id]);

    return NextResponse.json(result.rows);

  } catch (err) {
    console.error("❌ Error fetching games for user:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}