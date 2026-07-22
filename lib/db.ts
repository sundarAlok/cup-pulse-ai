import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const db = new Database("database/app.db");
const premiumUnlocksJsonPath = path.join(process.cwd(), "database", "premium-unlocks.json");

ensurePremiumUnlocksJsonFile();
syncPremiumUnlocksDbToJson();

function ensurePremiumUnlocksJsonFile() {
  if (!fs.existsSync(premiumUnlocksJsonPath)) {
    fs.writeFileSync(premiumUnlocksJsonPath, JSON.stringify([], null, 2), "utf8");
  }
}

function loadPremiumUnlocksJson(): PremiumUnlockJsonRecord[] {
  ensurePremiumUnlocksJsonFile();
  try {
    const fileContents = fs.readFileSync(premiumUnlocksJsonPath, "utf8");
    return JSON.parse(fileContents) as PremiumUnlockJsonRecord[];
  } catch (error) {
    console.error("Failed to load premium unlocks JSON:", error);
    return [];
  }
}

function savePremiumUnlocksJson(records: PremiumUnlockJsonRecord[]) {
  ensurePremiumUnlocksJsonFile();
  fs.writeFileSync(premiumUnlocksJsonPath, JSON.stringify(records, null, 2), "utf8");
}

function persistPremiumUnlockJsonRecord(record: PremiumUnlockJsonRecord) {
  const records = loadPremiumUnlocksJson();
  const existingIndex = records.findIndex((item) => item.wallet_address === record.wallet_address);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  savePremiumUnlocksJson(records);
}

function isValidTxHash(txHash: unknown): txHash is string {
  return typeof txHash === "string" && /^0x[a-fA-F0-9]{64}$/.test(txHash);
}

function syncPremiumUnlocksDbToJson() {
  const rows = db
    .prepare(
      `
      SELECT wallet_address, tx_hash, premium_access, created_at
      FROM premium_unlocks
    `
    )
    .all() as PremiumUnlockJsonRecord[];

  const validRows = rows.filter((record) => isValidTxHash(record.tx_hash));
  if (validRows.length === 0) {
    return;
  }

  const existingRecords = loadPremiumUnlocksJson();
  const mergedRecords = existingRecords.filter(
    (record) => !validRows.some((valid) => valid.wallet_address === record.wallet_address)
  );

  savePremiumUnlocksJson([...mergedRecords, ...validRows]);
}

type PremiumUnlockJsonRecord = {
  wallet_address: string;
  tx_hash: string;
  premium_access: number;
  created_at: string;
};

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

CREATE TABLE IF NOT EXISTS premium_unlocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallet_address TEXT UNIQUE NOT NULL,
  tx_hash TEXT NOT NULL,
  premium_access INTEGER DEFAULT 1,
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

export function recordPremiumUnlock(
  walletAddress: string,
  txHash: string
) {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `
      INSERT OR REPLACE INTO premium_unlocks (
        wallet_address,
        tx_hash,
        premium_access
      )
      VALUES (?, ?, 1)
    `
    )
    .run(walletAddress, txHash);

  const jsonRecord: PremiumUnlockJsonRecord = {
    wallet_address: walletAddress,
    tx_hash: txHash,
    premium_access: 1,
    created_at: now,
  };

  persistPremiumUnlockJsonRecord(jsonRecord);
  return result;
}

function getPremiumUnlockJsonByWallet(
  walletAddress: string
): PremiumUnlockJsonRecord | undefined {
  const records = loadPremiumUnlocksJson();
  return records.find((record) => record.wallet_address === walletAddress);
}

export function hasPremiumAccess(
  walletAddress: string
): boolean {
  return !!getPremiumUnlockByWallet(walletAddress);
}

export function getPremiumUnlockByWallet(
  walletAddress: string
) {
  const dbRecord = db
    .prepare(
      `
      SELECT wallet_address, tx_hash, premium_access
      FROM premium_unlocks
      WHERE wallet_address = ?
      LIMIT 1
    `
    )
    .get(walletAddress) as
    | {
        wallet_address: string;
        tx_hash: string;
        premium_access: number;
      }
    | undefined;

  if (dbRecord && isValidTxHash(dbRecord.tx_hash)) {
    return dbRecord;
  }

  const jsonRecord = getPremiumUnlockJsonByWallet(walletAddress);
  if (jsonRecord && isValidTxHash(jsonRecord.tx_hash)) {
    return {
      wallet_address: jsonRecord.wallet_address,
      tx_hash: jsonRecord.tx_hash,
      premium_access: jsonRecord.premium_access,
    };
  }

  return undefined;
}


