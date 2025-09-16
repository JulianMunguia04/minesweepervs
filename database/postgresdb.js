import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
import { v4 as uuidv4 } from "uuid";

const client = new Client({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

client.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ Connection error', err.stack));

export const createTables = async () => {
  try {
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        google_id VARCHAR(255) NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NULL,
        first_name VARCHAR(50) NULL,
        last_name VARCHAR(50) NULL,
        date_of_birth DATE NULL,
        profile_picture TEXT NULL,
        games_played INT DEFAULT 0,
        games_won INT DEFAULT 0,
        elo INT DEFAULT 1000,
        avg_points_per_second FLOAT DEFAULT 0,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS games (
        gameid UUID PRIMARY KEY,
        player1 UUID NOT NULL,
        player2 UUID NOT NULL,
        p1points INT DEFAULT 0,
        p2points INT DEFAULT 0,
        p1_starting_elo INT NOT NULL,
        p1_ending_elo INT NULL,
        p2_starting_elo INT NOT NULL,
        p2_ending_elo INT NULL,
        gamestate VARCHAR(10) DEFAULT 'playing', -- "playing" or "finished"
        winner UUID NULL, -- null, user id, or "tie" stored as string if needed
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    ];
    for (const query of tableQueries) {
      await client.query(query);
    }
    console.log('✅ Tables ensured in DB');
  } catch (err) {
    console.error('❌ DB error on table creation:', err.stack);
  }
};

//Run to create all tables
createTables()

//Email only sign up
export const emailSignup = async (username, email, password) => {
  try {
    // Generate a new UUID for the user
    const id = uuidv4();

    // Ensure required fields are provided
    if (!username || !email || !password) {
      return { success: false, message: 'Username, email, and password are required' };
    }

    // Insert new user
    const insertQuery = `
      INSERT INTO users 
      (id, google_id, username, email, password, first_name, last_name, date_of_birth)
      VALUES ($1, NULL, $2, $3, $4, NULL, NULL, NULL)
      RETURNING id, username, email, created_at
    `;

    const result = await client.query(insertQuery, [id, username, email, password]);

    return { success: true, user: result.rows[0] };

  } catch (err) {
    // Handle duplicate username/email
    if (err.code === '23505') {
      if (err.constraint === 'users_username_key') {
        return { success: false, message: 'Username already exists' };
      }
      if (err.constraint === 'users_email_key') {
        return { success: false, message: 'Email already exists' };
      }
      return { success: false, message: 'Duplicate value exists' };
    }

    console.error('❌ Error creating user:', err.stack);
    return { success: false, message: 'Database error' };
  }
};

//Google Sign Up
export const googleSignup = async (googleUser) => {
  try {
    const google_id = googleUser.sub;
    const email = googleUser.email;
    const first_name = googleUser.given_name || null;
    const last_name = googleUser.family_name || null;
    const picture = googleUser.picture || null;

    // Step 1: Check if user exists with this google_id
    const existingGoogleUser = await client.query(
      `SELECT * FROM users WHERE google_id = $1`,
      [google_id]
    );
    if (existingGoogleUser.rows.length > 0) {
      return { success: true, user: existingGoogleUser.rows[0] };
    }

    // Step 2: Check if user exists with same email (normal signup)
    const existingEmailUser = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (existingEmailUser.rows.length > 0) {
      // Link google_id to this account
      const update = await client.query(
        `UPDATE users 
         SET google_id = $1, profile_picture = $2, first_name = $3, last_name = $4
         WHERE email = $5
         RETURNING id, google_id, username, email, first_name, last_name, profile_picture, created_at`,
        [google_id, picture, first_name, last_name, email]
      );
      return { success: true, user: update.rows[0] };
    }

    // Step 3: New user -> generate unique username
    let baseUsername = email.split('@')[0];
    let username = baseUsername;
    let count = 0;

    while (true) {
      const check = await client.query(
        `SELECT id FROM users WHERE username = $1`,
        [username]
      );
      if (check.rows.length === 0) break;
      count++;
      username = `${baseUsername}${count}`;
    }

    // Step 4: Insert new Google user with generated UUID
    const id = uuidv4();

    const insertQuery = `
      INSERT INTO users
      (id, google_id, username, email, password, first_name, last_name, date_of_birth, profile_picture)
      VALUES ($1, $2, $3, $4, NULL, $5, $6, NULL, $7)
      RETURNING id, google_id, username, email, first_name, last_name, profile_picture, created_at
    `;

    const result = await client.query(insertQuery, [
      id,
      google_id,
      username,
      email,
      first_name,
      last_name,
      picture,
    ]);

    return { success: true, user: result.rows[0] };

  } catch (err) {
    console.error('❌ Error creating Google user:', err.stack);
    return { success: false, message: 'Database error' };
  }
};

export const createGameSQL = async (gameString) => {
  try {
    const game = JSON.parse(gameString);
    console.log("game check: ", game)

    const {
      gameId,
      player1,
      player2,
      player1_points,
      player2_points,
    } = game;

    const query = `
      INSERT INTO games (
        gameid,
        player1,
        player2,
        p1points,
        p2points,
        p1_starting_elo,
        p1_ending_elo,
        p2_starting_elo,
        p2_ending_elo,
        gamestate,
        winner
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `;

    const values = [
      gameId,
      player1.id,
      player2.id,
      player1_points,
      player2_points,
      player1.elo,   // starting ELO
      null,          // ending ELO initially null
      player2.elo,   // starting ELO
      null,          // ending ELO initially null
      'playing',     // initial gamestate
      null           // winner initially null
    ];

  console.log("values check ", values)

    const res = await client.query(query, values);
    console.log(`✅ Game saved in PostgreSQL: ${res.rows[0].gameid}`);
  } catch (err) {
    console.error('❌ Error creating game in PostgreSQL:', err.stack);
  }
};

export async function gameEndedSQL(gameId, gameData) {
  try {
    console.log("pg data", gameData);
    const game = JSON.parse(gameData);

    // Determine winner
    let winner =
      game.player1_points > game.player2_points
        ? game.player1.id
        : game.player2_points > game.player1_points
        ? game.player2.id
        : null; // draw = null

    // Determine scores for ELO calculation
    let p1_score, p2_score;
    if (winner === game.player1.id) {
      p1_score = 1;
      p2_score = 0;
    } else if (winner === game.player2.id) {
      p1_score = 0;
      p2_score = 1;
    } else {
      p1_score = 0.5;
      p2_score = 0.5;
    }

    // Calculate new ELOs
    const p1_new_elo = calculateElo(game.player1.elo, game.player2.elo, p1_score);
    const p2_new_elo = calculateElo(game.player2.elo, game.player1.elo, p2_score);

    // Update game in DB
    const query = `
      UPDATE games
      SET p1points = $1,
          p2points = $2,
          winner = $3,
          p1_ending_elo = $4,
          p2_ending_elo = $5,
          gamestate = 'finished',
          updated_at = NOW()
      WHERE gameid = $6
      RETURNING *;
    `;
    const values = [
      game.player1_points,
      game.player2_points,
      winner,
      p1_new_elo,
      p2_new_elo,
      gameId
    ];

    const res = await client.query(query, values);
    console.log(`✅ Game ${gameId} updated in SQL`, res.rows[0]);

    // Update users' ELOs safely
    await client.query(
      `UPDATE users SET elo = $1 WHERE id = $2`,
      [p1_new_elo, game.player1.id]
    );

    await client.query(
      `UPDATE users SET elo = $1 WHERE id = $2`,
      [p2_new_elo, game.player2.id]
    );

    return res.rows[0];

  } catch (err) {
    console.error(`❌ Failed to update game ${gameId} in SQL:`, err);
    throw err;
  }
}

export function calculateElo(playerElo, opponentElo, score, k = 32) {
  // Expected score based on difference in ELO
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));

  // New rating
  const newElo = playerElo + k * (score - expectedScore);

  return Math.round(newElo);
}

export default client;