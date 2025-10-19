import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import client from "../../../database/postgresdb";

export async function POST(req) {
  // Parse cookies + token
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

    const username = decoded.username;
    if (!username) {
      return NextResponse.json({ message: "Token missing username" }, { status: 401 });
    }

    // Parse request body (we expect friend_username)
    const body = await req.json();
    const { friend_username } = body || {};
    if (!friend_username) {
      return NextResponse.json({ message: "Friend username is required" }, { status: 400 });
    }

    // Resolve IDs
    const getUserQuery = "SELECT id FROM users WHERE username = $1";
    const userResult = await client.query(getUserQuery, [username]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: "Current user not found" }, { status: 401 });
    }
    const user_id = userResult.rows[0].id;

    const friendResult = await client.query(getUserQuery, [friend_username]);
    if (friendResult.rows.length === 0) {
      return NextResponse.json({ message: "Friend user not found" }, { status: 404 });
    }
    const friend_id = friendResult.rows[0].id;

    if (user_id === friend_id) {
      return NextResponse.json({ message: "You cannot add yourself" }, { status: 400 });
    }

    // Begin transaction to avoid race conditions
    try {
      await client.query("BEGIN");

      // Check existing direct request A -> B
      const directQ = `
        SELECT id, status FROM friends
        WHERE user_id = $1 AND friend_id = $2
        FOR UPDATE
      `;
      const directRes = await client.query(directQ, [user_id, friend_id]);

      if (directRes.rows.length > 0) {
        const status = directRes.rows[0].status;
        if (status === "accepted") {
          await client.query("COMMIT");
          return NextResponse.json({ message: "Already friends" }, { status: 400 });
        } else if (status === "requested") {
          await client.query("COMMIT");
          return NextResponse.json({ message: "Friend request already sent" }, { status: 400 });
        } else {
          // other statuses if you add them later
          await client.query("COMMIT");
          return NextResponse.json({ message: `Request already exists with status: ${status}` }, { status: 400 });
        }
      }

      // Check reverse request B -> A
      const reverseQ = `
        SELECT id, status FROM friends
        WHERE user_id = $1 AND friend_id = $2
        FOR UPDATE
      `;
      const reverseRes = await client.query(reverseQ, [friend_id, user_id]);

      if (reverseRes.rows.length > 0) {
        const reverseRow = reverseRes.rows[0];

        if (reverseRow.status === "requested") {
          // Accept the reverse request and create the complementary accepted row
          const updateReverse = `
            UPDATE friends
            SET status = 'accepted'
            WHERE id = $1
            RETURNING *
          `;
          const updated = await client.query(updateReverse, [reverseRow.id]);

          const insertAccepted = `
            INSERT INTO friends (user_id, friend_id, status)
            VALUES ($1, $2, 'accepted')
            RETURNING *
          `;
          const inserted = await client.query(insertAccepted, [user_id, friend_id]);

          await client.query("COMMIT");
          return NextResponse.json({
            message: "Friend request accepted — you are now friends",
            accepted: {
              updated_reverse: updated.rows[0],
              inserted_pair: inserted.rows[0],
            },
          });
        } else if (reverseRow.status === "accepted") {
          // Weird state: reverse already accepted but direct missing — create direct accepted row
          const insertAccepted = `
            INSERT INTO friends (user_id, friend_id, status)
            VALUES ($1, $2, 'accepted')
            RETURNING *
          `;
          const inserted = await client.query(insertAccepted, [user_id, friend_id]);
          await client.query("COMMIT");
          return NextResponse.json({
            message: "Friendship completed (accepted)",
            inserted_pair: inserted.rows[0],
          });
        } else {
          // other statuses
          await client.query("COMMIT");
          return NextResponse.json({ message: `Cannot add friend: reverse has status ${reverseRow.status}` }, { status: 400 });
        }
      }

      // No existing direct or reverse requests — create a requested row A -> B
      const insertRequest = `
        INSERT INTO friends (user_id, friend_id, status)
        VALUES ($1, $2, 'requested')
        RETURNING *
      `;
      const requestRes = await client.query(insertRequest, [user_id, friend_id]);

      await client.query("COMMIT");
      return NextResponse.json({
        message: "Friend request sent",
        request: requestRes.rows[0],
      });

    } catch (txErr) {
      await client.query("ROLLBACK");
      console.error("❌ Transaction error adding friend:", txErr);
      return NextResponse.json({ message: "Server error (transaction)" }, { status: 500 });
    }

  } catch (err) {
    console.error("❌ Error in addfriend route:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
