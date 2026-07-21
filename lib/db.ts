import Database from "better-sqlite3";

const db = new Database("database/app.db");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  secret_words TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export default db;

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  secret_words: string;
  points: number;
};


export function getUserById(
  id: number
): User | undefined {
  return db
    .prepare(
      `
      SELECT *
      FROM users
      WHERE id = ?
    `
    )
    .get(id) as User | undefined;
}

export function getUserByEmail(
  email: string
): User | undefined {
  return db
    .prepare(
      `
      SELECT *
      FROM users
      WHERE email = ?
    `
    )
    .get(email) as User | undefined;
}

export function createUser(
  username: string,
  email: string,
  password: string,
  secretWords: string
) {
  return db
    .prepare(
      `
      INSERT INTO users
      (
        username,
        email,
        password,
        secret_words,
        points
      )
      VALUES (?, ?, ?, ?, 0)
    `
    )
    .run(
      username,
      email,
      password,
      secretWords
    );
}

export function getUserPoints(
  userId: number
): number {
  const user = db
    .prepare(
      `
      SELECT points
      FROM users
      WHERE id = ?
    `
    )
    .get(userId) as
    | { points: number }
    | undefined;

  return user?.points ?? 0;
}

export function addPoints(
  userId: number,
  points: number
): number {
  db.prepare(
    `
    UPDATE users
    SET points = points + ?
    WHERE id = ?
  `
  ).run(points, userId);

  return getUserPoints(userId);
}

export function deductPoints(
  userId: number,
  points: number
): number {
  db.prepare(
    `
    UPDATE users
    SET points =
      CASE
        WHEN points - ? < 0 THEN 0
        ELSE points - ?
      END
    WHERE id = ?
  `
  ).run(points, points, userId);

  return getUserPoints(userId);
}

export function getLeaderboard() {
  return db
    .prepare(
      `
      SELECT
        id,
        username,
        points
      FROM users
      ORDER BY points DESC
      LIMIT 50
    `
    )
    .all();
}