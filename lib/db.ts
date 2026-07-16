import Database from "better-sqlite3";

const db = new Database("database/app.db");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  points INTEGER DEFAULT 120
);
`);

export default db;

export function getUserPoints() {
  const user = db
    .prepare(
      "SELECT points FROM users LIMIT 1"
    )
    .get() as { points: number } | undefined;

  return user?.points || 120;
}

export function addPoints(
  points: number
) {
  const user = db
    .prepare(
      "SELECT id FROM users LIMIT 1"
    )
    .get() as { id: number } | undefined;

  if (!user) {
    db.prepare(
      `
      INSERT INTO users
      (username, points)
      VALUES (?, ?)
    `
    ).run("fan", points);

    return;
  }

  db.prepare(`
    UPDATE users
    SET points = points + ?
    WHERE id = ?
  `).run(points, user.id);
}