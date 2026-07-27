import { FieldValue, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";

const db = adminDb;

export type FirestoreUserProfile = {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  photoURL?: string | null;
  secretWords?: string;
  authProvider?: string;
  points: number;
  createdAt?: string;
  lastSeenAt?: string;
};

export type FirestoreCheckinRecord = {
  userId: string;
  lastCheckin: string;
  streak: number;
  updatedAt?: string;
};

export type FirestorePremiumUnlock = {
  walletAddress: string;
  txHash: string;
  premiumAccess: number;
  createdAt?: string | Timestamp;
  verifiedAt?: string | Timestamp;
};

export type DemoPredictionRecord = {
  uid: string;
  predictedWinner: "Team A" | "Team X";
  createdAt: string;
};

export type DemoMatchState = {
  id: string;
  status: "NOT_STARTED" | "LIVE" | "FINISHED";
  winner: "Team A" | "Team X" | null;
  createdAt?: string;
  updatedAt?: string;
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeUid(uid: string) {
  return uid.trim();
}

async function setDocument<T extends Record<string, unknown>>(collectionName: string, id: string, data: T) {
  const docRef = db.collection(collectionName).doc(id);
  await docRef.set(data, { merge: true });
}

export async function ensureUserProfile(uid: string, overrides: Partial<FirestoreUserProfile> = {}) {
  const safeUid = normalizeUid(uid);
  const profileRef = db.collection("users").doc(safeUid);
  const snapshot = await profileRef.get();
  const existing = snapshot.exists ? (snapshot.data() as Partial<FirestoreUserProfile>) : {};

  const merged: FirestoreUserProfile = {
    uid: safeUid,
    email: existing.email ?? "",
    username: existing.username ?? `user-${safeUid.slice(0, 6)}`,
    displayName: existing.displayName ?? existing.username ?? `user-${safeUid.slice(0, 6)}`,
    photoURL: existing.photoURL ?? null,
    points: existing.points ?? 0,
    secretWords: existing.secretWords ?? "",
    authProvider: existing.authProvider ?? overrides.authProvider ?? "email",
    createdAt: existing.createdAt ?? nowIso(),
    lastSeenAt: nowIso(),
    ...overrides,
  };

  await setDocument<FirestoreUserProfile>("users", safeUid, merged);
  await setDocument<FirestoreUserProfile>("profiles", safeUid, merged);

  return merged;
}

export async function getUserProfile(uid: string) {
  const safeUid = normalizeUid(uid);
  const snapshot = await db.collection("users").doc(safeUid).get();
  return snapshot.exists ? (snapshot.data() as FirestoreUserProfile) : null;
}

export async function updateUserProfile(uid: string, updates: Partial<FirestoreUserProfile>) {
  const safeUid = normalizeUid(uid);
  const current = await getUserProfile(safeUid);
  const nextProfile: FirestoreUserProfile = {
    uid: safeUid,
    email: current?.email ?? "",
    username: current?.username ?? `user-${safeUid.slice(0, 6)}`,
    displayName: current?.displayName ?? current?.username ?? `user-${safeUid.slice(0, 6)}`,
    photoURL: current?.photoURL ?? null,
    secretWords: current?.secretWords ?? "",
    authProvider: current?.authProvider ?? "email",
    points: current?.points ?? 0,
    createdAt: current?.createdAt ?? nowIso(),
    lastSeenAt: nowIso(),
    ...updates,
  };

  await setDocument<FirestoreUserProfile>("users", safeUid, nextProfile);
  await setDocument<FirestoreUserProfile>("profiles", safeUid, nextProfile);

  return nextProfile;
}

export async function getUserPoints(uid: string) {
  const profile = await getUserProfile(uid);
  return profile?.points ?? 0;
}

export async function addUserPoints(uid: string, delta: number) {
  const safeUid = normalizeUid(uid);
  const profile = await getUserProfile(safeUid);
  const currentPoints = profile?.points ?? 0;
  const nextPoints = currentPoints + delta;

  await setDocument<{ points: number; lastSeenAt: string }>("users", safeUid, {
    points: nextPoints,
    lastSeenAt: nowIso(),
  });

  await setDocument<{ points: number; lastSeenAt: string }>("profiles", safeUid, {
    points: nextPoints,
    lastSeenAt: nowIso(),
  });

  return nextPoints;
}

export async function deductUserPoints(uid: string, delta: number) {
  const safeUid = normalizeUid(uid);
  const profile = await getUserProfile(safeUid);
  const currentPoints = profile?.points ?? 0;
  const nextPoints = Math.max(0, currentPoints - delta);

  await setDocument<{ points: number; lastSeenAt: string }>("users", safeUid, {
    points: nextPoints,
    lastSeenAt: nowIso(),
  });

  await setDocument<{ points: number; lastSeenAt: string }>("profiles", safeUid, {
    points: nextPoints,
    lastSeenAt: nowIso(),
  });

  return nextPoints;
}

export async function getCheckinRecord(uid: string) {
  const snapshot = await db.collection("checkins").doc(normalizeUid(uid)).get();
  return snapshot.exists ? (snapshot.data() as FirestoreCheckinRecord) : null;
}

export async function saveCheckinRecord(uid: string, today: string, streak: number) {
  const safeUid = normalizeUid(uid);
  const record: FirestoreCheckinRecord = {
    userId: safeUid,
    lastCheckin: today,
    streak,
    updatedAt: nowIso(),
  };

  await setDocument<FirestoreCheckinRecord>("checkins", safeUid, record);
  return record;
}

export async function getPremiumUnlock(walletAddress: string) {
  const snapshot = await db.collection("premiumUnlocks").doc(walletAddress.trim()).get();
  return snapshot.exists ? (snapshot.data() as FirestorePremiumUnlock) : null;
}

export async function recordPremiumUnlock(walletAddress: string, txHash: string) {
  const safeWallet = walletAddress.trim();
  const record = {
    walletAddress: safeWallet,
    txHash,
    premiumAccess: 1,
    createdAt: FieldValue.serverTimestamp(),
    verifiedAt: FieldValue.serverTimestamp(),
  };

  await setDocument<Record<string, unknown>>("premiumUnlocks", safeWallet, record);
  return record as FirestorePremiumUnlock;
}

export async function getDemoMatchState() {
  const snapshot = await db.collection("gameState").doc("demoMatch").get();
  if (!snapshot.exists) {
    const initialState: DemoMatchState = {
      id: "demoMatch",
      status: "NOT_STARTED",
      winner: null,
    };

    await setDocument<DemoMatchState>("gameState", "demoMatch", initialState);
    return initialState;
  }

  return (snapshot.data() as DemoMatchState) ?? {
    id: "demoMatch",
    status: "NOT_STARTED",
    winner: null,
  };
}

export async function updateDemoMatchState(state: Partial<DemoMatchState>) {
  const current = await getDemoMatchState();
  const nextState: DemoMatchState = {
    id: "demoMatch",
    status: current.status,
    winner: current.winner,
    ...state,
    updatedAt: nowIso(),
  };

  await setDocument<DemoMatchState>("gameState", "demoMatch", nextState);
  return nextState;
}

export async function storeDemoPrediction(uid: string, predictedWinner: "Team A" | "Team X") {
  const safeUid = normalizeUid(uid);
  const record: DemoPredictionRecord = {
    uid: safeUid,
    predictedWinner,
    createdAt: nowIso(),
  };

  await setDocument<DemoPredictionRecord>("demoPredictions", safeUid, record);
  return record;
}

export async function getDemoPrediction(uid: string) {
  const snapshot = await db.collection("demoPredictions").doc(normalizeUid(uid)).get();
  return snapshot.exists ? (snapshot.data() as DemoPredictionRecord) : null;
}

export async function getDemoPredictions() {
  const q = db.collection("demoPredictions");
  const snapshot = await q.get();
  return snapshot.docs.map((docSnap: QueryDocumentSnapshot) => docSnap.data() as DemoPredictionRecord);
}

export async function storePredictionLog(uid: string, data: { prompt: string; prediction: string; confidence: string; reason: string }) {
  const safeUid = normalizeUid(uid);
  const record = {
    uid: safeUid,
    ...data,
    createdAt: nowIso(),
  };

  await setDocument<{ uid: string; prompt: string; prediction: string; confidence: string; reason: string; createdAt: string }>("predictionLogs", `${safeUid}-${Date.now()}`, record);
  return record;
}

export async function getLeaderboardRows(limitCount = 50) {
  const q = db.collection("users").orderBy("points", "desc").limit(limitCount);
  const snapshot = await q.get();

  return snapshot.docs.map((docSnap: QueryDocumentSnapshot) => {
    const data = docSnap.data() as FirestoreUserProfile;
    const username = data.username || data.displayName || `user-${docSnap.id.slice(0, 6)}`;
    return {
      id: docSnap.id,
      username,
      displayName: data.displayName ?? "",
      points: data.points ?? 0,
      photoURL: data.photoURL ?? null,
    };
  });
}

export async function seedDemoData() {
  const demoUid = "demo-user";

  await ensureUserProfile(demoUid, {
    email: "demo@cuppulse.ai",
    username: "Demo Fan",
    displayName: "Demo Fan",
    secretWords: "demo fan test",
    points: 250,
  });

  await setDocument<FirestoreCheckinRecord>("checkins", demoUid, {
    userId: demoUid,
    lastCheckin: new Date().toISOString().slice(0, 10),
    streak: 4,
    updatedAt: nowIso(),
  });

  await setDocument<FirestorePremiumUnlock>("premiumUnlocks", "demo-wallet", {
    walletAddress: "demo-wallet",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    premiumAccess: 1,
    createdAt: nowIso(),
    verifiedAt: nowIso(),
  });

  await updateDemoMatchState({
    status: "NOT_STARTED",
    winner: null,
  });

  return true;
}
