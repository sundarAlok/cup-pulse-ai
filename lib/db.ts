import Database from "better-sqlite3";

const db = new Database("database/app.db");

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    points INTEGER DEFAULT 120
  );
`);

// Create default user
const existingUser = db
  .prepare("SELECT id FROM users LIMIT 1")
  .get();

if (!existingUser) {
  db.prepare(`
    INSERT INTO users (username, points)
    VALUES (?, ?)
  `).run("fan", 120);
}

export default db;

// Get current points
export function getUserPoints(): number {
  const user = db
    .prepare(
      "SELECT points FROM users LIMIT 1"
    )
    .get() as { points: number };

  return user?.points ?? 120;
}

// Add points
export function addPoints(
  points: number
): number {
  db.prepare(`
    UPDATE users
    SET points = points + ?
    WHERE id = (
      SELECT id FROM users LIMIT 1
    )
  `).run(points);

  return getUserPoints();
}

// Deduct points
export function deductPoints(
  points: number
): number {
  db.prepare(`
    UPDATE users
    SET points = MAX(points - ?, 0)
    WHERE id = (
      SELECT id FROM users LIMIT 1
    )
  `).run(points);

  return getUserPoints();
}