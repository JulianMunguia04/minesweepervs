import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

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
        id SERIAL PRIMARY KEY,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

export const emailSignup = async (username, email, password) => {
  try {
    const insertQuery = `
      INSERT INTO users 
      (google_id, username, email, password, first_name, last_name, date_of_birth)
      VALUES (NULL, $1, $2, $3, NULL, NULL, NULL)
      RETURNING id, username, email, created_at
    `;

    const result = await client.query(insertQuery, [username, email, password]);

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
      // generic unique violation
      return { success: false, message: 'Duplicate value exists' };
    }

    console.error('❌ Error creating user:', err.stack);
    return { success: false, message: 'Database error' };
  }
};

export default client;