# Firestore Configuration & Deployment Guide

## Firestore Collections Setup

### Auto-Created Collections (No Manual Setup Needed)
Firestore automatically creates single-field indexes. These collections will auto-create on first write:

```
✅ users
✅ profiles
✅ checkins
✅ premiumUnlocks
✅ gameState
✅ demoPredictions
✅ predictionLogs
```

### Recommended Composite Indexes

**If you see "Firestore index required" error for complex queries:**

#### 1. Leaderboard Index (Likely Auto-Created)
```
Collection: users
Fields:
  - points (Descending)
  - __name__ (Ascending)
Query: .orderBy('points', 'desc').limit(50)
Status: ✅ Auto-created on first query
```

**To manually create (Firebase Console):**
1. Go to: Firestore → Indexes → Composite
2. Create Index:
   - Collection: `users`
   - Field 1: `points` (Descending)
   - Field 2: `__name__` (Ascending)

### Document Structure Validation

**Collection: users**
```
users/
  ├── user1/
  │   ├── uid: "user1"
  │   ├── email: "user@example.com"
  │   ├── username: "username"
  │   ├── displayName: "Display Name"
  │   ├── photoURL: "https://..." (nullable)
  │   ├── secretWords: "secret-phrase"
  │   ├── points: 100 (number)
  │   ├── createdAt: "2026-07-26T12:00:00Z" (ISO string)
  │   └── lastSeenAt: "2026-07-26T12:00:00Z" (ISO string)
  │
  └── user2/
      └── [same structure]
```

**Collection: profiles** (mirrors users)
```
profiles/
  ├── user1/ [identical to users/user1]
  └── user2/ [identical to users/user2]
```

**Collection: checkins**
```
checkins/
  ├── user1/
  │   ├── userId: "user1"
  │   ├── lastCheckin: "2026-07-26"
  │   ├── streak: 5
  │   └── updatedAt: "2026-07-26T12:00:00Z"
  │
  └── user2/
      └── [same structure]
```

**Collection: premiumUnlocks**
```
premiumUnlocks/
  ├── 0x123abc.../
  │   ├── walletAddress: "0x123abc..."
  │   ├── txHash: "0x789def..."
  │   ├── premiumAccess: 1
  │   ├── createdAt: {timestamp}
  │   └── verifiedAt: {timestamp}
  │
  └── 0x456def.../
      └── [same structure]
```

**Collection: gameState**
```
gameState/
  ├── demoMatch/
  │   ├── id: "demoMatch"
  │   ├── status: "NOT_STARTED" | "LIVE" | "FINISHED"
  │   ├── winner: "Team A" | "Team X" | null
  │   ├── createdAt: "2026-07-26T12:00:00Z"
  │   └── updatedAt: "2026-07-26T12:00:00Z"
```

**Collection: demoPredictions**
```
demoPredictions/
  ├── user1/
  │   ├── uid: "user1"
  │   ├── predictedWinner: "Team A" | "Team X"
  │   └── createdAt: "2026-07-26T12:00:00Z"
  │
  └── user2/
      └── [same structure]
```

**Collection: predictionLogs**
```
predictionLogs/
  ├── user1-1690379200000/
  │   ├── uid: "user1"
  │   ├── prompt: "Will Brazil win?"
  │   ├── prediction: "Brazil wins"
  │   ├── confidence: "85%"
  │   ├── reason: "Strong squad"
  │   └── createdAt: "2026-07-26T12:00:00Z"
  │
  └── user2-1690379205000/
      └── [same structure]
```

---

## Firestore Rules Deployment

### Current Rules (firestore.rules)
Located at: `e:\Learning\projects\cup-pulse-ai\firestore.rules`

### Deploy Rules (Firebase CLI)

**1. Install Firebase CLI**
```bash
npm install -g firebase-tools
```

**2. Login to Firebase**
```bash
firebase login
```

**3. Initialize Firebase in project (if not done)**
```bash
firebase init firestore
# Select your project
# Keep existing configuration
```

**4. Deploy Rules**
```bash
firebase deploy --only firestore:rules
```

**5. Verify Deployment**
```bash
firebase firestore:get-rules
```

### Firestore Rules Explanation

#### Public Read Access
```firestore
match /users/{userId} {
  allow read: if true;  // Anyone can read leaderboard
}
```
✅ Enables public leaderboard
✅ Client can display top 50 users

#### Backend-Only Writes
```firestore
match /users/{userId} {
  allow create: if false;    // No client creates
  allow update: if false;    // No client updates
  allow delete: if false;    // No client deletes
}
```
✅ Only Admin SDK can write
✅ Prevents PERMISSION_DENIED errors

#### User-Scoped Data
```firestore
match /checkins/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if false;  // Admin SDK only
}
```
✅ Users can only read their own checkins
✅ Admin SDK updates from backend

#### Default Deny
```firestore
match /{document=**} {
  allow read, write: if false;
}
```
✅ Any unmapped path is denied
✅ Security by default

---

## Environment Configuration

### Local Development (.env.local)

Create file: `e:\Learning\projects\cup-pulse-ai\.env.local`

```env
# Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (Secret - Backend Only)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your_project_id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxx@your_project_id.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxx%40your_project_id.iam.gserviceaccount.com"}'
```

### Vercel Deployment

**1. Set Environment Variables**
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste public values

vercel env add FIREBASE_SERVICE_ACCOUNT_KEY
# Paste secret service account JSON (copy the entire JSON)
```

**2. Verify in Vercel Dashboard**
- Project Settings → Environment Variables
- ✅ All NEXT_PUBLIC_* variables visible in build logs
- ✅ FIREBASE_SERVICE_ACCOUNT_KEY hidden in build logs

**3. Deploy**
```bash
vercel deploy --prod
```

### Getting Firebase Credentials

#### Get Client SDK Config
```
Firebase Console → Project Settings → General
Copy the firebaseConfig object
↓
Map to NEXT_PUBLIC_* variables
```

#### Get Admin SDK Service Account
```
Firebase Console → Project Settings → Service Accounts
Click "Generate New Private Key"
↓
Download JSON file
↓
Paste entire JSON as FIREBASE_SERVICE_ACCOUNT_KEY
```

---

## Firestore Billing & Quotas

### Free Tier Limits
- **Read Operations:** 50,000/day
- **Write Operations:** 20,000/day
- **Delete Operations:** 20,000/day
- **Storage:** 1 GB
- **Stored Data:** 1 GB

### Typical Usage (CupPulse AI)
```
Per User Per Day:
├── Login: 1 read (users collection)
├── Checkin: 2 reads + 2 writes (checkins + users)
├── Prediction: 1 read + 2 writes (logs + users)
├── Rewards: 1 read + 1 write (users)
└── Leaderboard: 1 read (users, limit 50)

Approximately:
├── 100 users/day → ~700 read + 600 write ops
├── 1,000 users/day → ~7,000 read + 6,000 write ops
└── 10,000 users/day → ~70,000 read + 60,000 write ops (exceeds free tier)

Recommendation:
- Use free tier for development/testing
- Upgrade to paid when scaling beyond 5,000 daily active users
```

---

## Security Best Practices

### ✅ Implemented
1. **Admin SDK for Backend Writes**
   - Bypasses Firestore rules safely
   - Only runs on server, not exposed to clients

2. **Client SDK for Read-Only**
   - Read leaderboard
   - Real-time game state updates
   - Cannot write directly

3. **Rules as Backup**
   - Even if compromised, rules deny client writes
   - Checkins only readable by owner
   - Predictions only readable by owner

4. **Cookie-Based Auth**
   - httpOnly cookies prevent JavaScript access
   - Prevents XSS token theft
   - Protected by HTTPS in production

### ⚠️ Important

**Never:**
- ❌ Commit FIREBASE_SERVICE_ACCOUNT_KEY to git
- ❌ Expose FIREBASE_SERVICE_ACCOUNT_KEY in client code
- ❌ Use client SDK to write user data
- ❌ Trust client input for userId

**Always:**
- ✅ Read userId from httpOnly cookies
- ✅ Validate all inputs on backend
- ✅ Use Admin SDK for writes
- ✅ Test Firestore rules with Firebase Emulator

---

## Testing Firestore Locally

### Firebase Emulator Suite

**1. Install**
```bash
npm install -g firebase-tools
```

**2. Start Emulator**
```bash
firebase emulators:start --only firestore
```

**3. Configure for Local Testing**
In `next.config.ts` or during development:
```typescript
if (process.env.NODE_ENV === "development") {
  // Use emulator
  const EMULATOR_HOST = "http://127.0.0.1:8080";
  // Configure firebase to use emulator
}
```

**4. Test Rules**
```bash
firebase emulators:exec "npm run test"
```

---

## Firestore Backup & Recovery

### Enable Automatic Backups (Google Cloud)
```
Firestore → Settings → Backups
Create Schedule:
  - Frequency: Daily
  - Retention: 30 days
  - Location: Multi-region
```

### Manual Backup
```bash
gcloud firestore export gs://your-bucket/backup-$(date +%Y%m%d)
```

### Recovery
```bash
gcloud firestore import gs://your-bucket/backup-20260726/
```

---

## Monitoring & Debugging

### Firestore Metrics (Firebase Console)
```
Analytics → Database → Firestore
├── Requests: Shows read/write/delete counts
├── Errors: Shows permission denied, quota exceeded
├── Storage: Shows current data size
└── Billing: Shows estimated costs
```

### Real-Time Logs (Firebase Console)
```
Firestore → Rules → Logs
├── Filter by collection
├── View rule evaluation
└── Debug permission denied errors
```

### Check Specific Operations
```bash
# Count documents in a collection
firebase firestore:get-docs users --all

# Get specific document
firebase firestore:get-docs users/uid1

# Delete test data
firebase firestore:delete users/test-uid
```

---

## Migration from SQLite (If Needed)

### Export Data from SQLite
```bash
# Use lib/db.ts backup or:
sqlite3 database/app.db ".dump" > backup.sql
```

### Transform to Firestore Format
```typescript
// Create a migration script
import admin from "firebase-admin";

const db = admin.firestore();

async function migrateUsers() {
  const users = await fetchFromSQLite(); // your SQL query
  
  for (const user of users) {
    await db.collection("users").doc(user.id).set({
      uid: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name,
      points: user.points,
      createdAt: new Date(user.created_at).toISOString(),
      lastSeenAt: new Date().toISOString(),
    });
  }
  
  console.log(`Migrated ${users.length} users`);
}

migrateUsers().catch(console.error);
```

### Import to Firestore
```bash
# Option 1: Firebase Console UI
Firestore → Start Collection → Import JSON

# Option 2: Use migration script
npx ts-node migration.ts

# Option 3: Batch import
gcloud firestore import gs://bucket/backup/
```

---

## Troubleshooting

### PERMISSION_DENIED Error
**Cause:** Firestore rules deny the operation
**Solution:**
1. Check if using client SDK for writes (should use Admin SDK)
2. Verify userId matches authenticated user
3. Check rules allow the operation
4. Test with Firestore Emulator

### Request Too Large
**Cause:** Document or batch exceeds 1 MB
**Solution:**
1. Split into smaller documents
2. Use subcollections for large arrays
3. Compress data if possible

### Query Requires Index
**Cause:** Complex query without composite index
**Solution:**
1. Click link in error message
2. Firestore auto-creates index
3. Wait 5-10 minutes for creation
4. Retry query

### Quota Exceeded
**Cause:** Exceeded daily operation limits
**Solution:**
1. Upgrade to paid plan
2. Implement caching on client
3. Batch operations
4. Reduce query frequency

---

## Performance Optimization

### 1. Batch Writes
```typescript
const batch = admin.firestore().batch();

for (const user of users) {
  const ref = db.collection("users").doc(user.uid);
  batch.set(ref, userData);
}

await batch.commit();
```

### 2. Field Indexing
Only index fields you query:
```firestore
Index on:
  - users: points (for leaderboard)
  - others: minimal (defaults auto-create)
```

### 3. Pagination for Large Results
```typescript
// First page
const first = await db
  .collection("users")
  .orderBy("points", "desc")
  .limit(50)
  .get();

// Next page using lastDoc
const next = await db
  .collection("users")
  .orderBy("points", "desc")
  .startAfter(lastDoc)
  .limit(50)
  .get();
```

### 4. Selective Reads
```typescript
// Don't: Read entire document
const user = await db.collection("users").doc(uid).get();

// Do: Read only points field
const points = (await db.collection("users").doc(uid).get()).get("points");
```

---

## Production Checklist

- [ ] ✅ All SQLite references removed
- [ ] ✅ Firestore rules deployed
- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ Admin SDK service account configured
- [ ] ✅ Client SDK config public variables set
- [ ] ✅ Firestore indexes created (auto or manual)
- [ ] ✅ Backup strategy enabled
- [ ] ✅ Monitoring alerts configured
- [ ] ✅ Load testing completed
- [ ] ✅ Security rules tested
- [ ] ✅ No permission errors in staging
- [ ] ✅ Ready for production deployment

---

**Status: ✅ Configuration Complete**
**All Firestore setup ready for deployment**
