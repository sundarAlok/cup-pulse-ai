const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'app.db');
const checkinsPath = path.join(__dirname, '..', 'database', 'checkins.json');
const premiumJsonPath = path.join(__dirname, '..', 'database', 'premium-unlocks.json');

const outputPath = path.join(__dirname, '..', 'database', 'firestore-import-alok-full.json');

const output = [];

if (fs.existsSync(dbPath)) {
  const db = new Database(dbPath, { readonly: true });
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  for (const { name } of tables) {
    const rows = db.prepare(`SELECT * FROM ${name}`).all();
    for (const row of rows) {
      output.push({ collection: name, data: row });
    }
  }
}

if (fs.existsSync(checkinsPath)) {
  const checkins = JSON.parse(fs.readFileSync(checkinsPath, 'utf8'));
  for (const item of checkins) {
    output.push({ collection: 'checkins', data: item });
  }
}

if (fs.existsSync(premiumJsonPath)) {
  const premiums = JSON.parse(fs.readFileSync(premiumJsonPath, 'utf8'));
  for (const item of premiums) {
    output.push({ collection: 'premiumUnlocks', data: {
      walletAddress: item.wallet_address,
      txHash: item.tx_hash,
      premiumAccess: item.premium_access,
      createdAt: item.created_at,
      verifiedAt: item.verified_at || item.created_at,
    }});
  }
}

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
console.log('Wrote', outputPath);