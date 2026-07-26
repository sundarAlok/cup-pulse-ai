## Firebase Admin setup for cup-pulse-ai

This project uses `firebase` client SDK for browser auth and `firebase-admin` for server-side API routes.

### Required environment variables

- `FIREBASE_SERVICE_ACCOUNT_KEY`
  - JSON string of a Firebase service account key
  - Example: `{"type":"service_account",...}`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `FIREBASE_PROJECT_ID` (optional fallback)

### Why this is needed

API routes like `/api/checkin` currently run on the server. They must use `firebase-admin` to write to Firestore because backend requests do not have `request.auth` from Firebase client auth.

### How to install

1. `npm install firebase-admin`
2. Add the env var to your local env or deployment
3. Restart Next.js

### Local dev

If you don’t want to store the service account JSON directly, set `GOOGLE_APPLICATION_CREDENTIALS` to a file path instead.
