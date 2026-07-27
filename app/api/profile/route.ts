import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getCheckinRecord, getLeaderboardRows, getUserProfile, updateUserProfile } from "@/lib/firebaseStore";

function formatJoinedDate(value?: string | null) {
  if (!value) {
    return "Recently joined";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Recently joined";
  }

  return parsed.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function getPredictionCount(uid: string) {
  const snapshot = await adminDb.collection("predictionLogs").where("uid", "==", uid).get();
  return snapshot.size;
}

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await getUserProfile(userId);

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const [leaderboardRows, checkinRecord, predictionCount] = await Promise.all([
    getLeaderboardRows(1000),
    getCheckinRecord(userId),
    getPredictionCount(userId),
  ]);

  const rank = leaderboardRows.findIndex((row) => row.id === userId) + 1;

  return NextResponse.json({
    authenticated: true,
    profile: {
      uid: user.uid,
      username: user.username ?? "",
      displayName: user.displayName ?? "",
      photoURL: user.photoURL ?? "",
      secretWords: user.secretWords ?? "",
      authProvider: user.authProvider ?? "email",
      email: user.email ?? "",
      points: user.points ?? 0,
      rank: rank > 0 ? rank : 0,
      streak: checkinRecord?.streak ?? 0,
      predictions: predictionCount,
      joined: formatJoinedDate(user.createdAt),
      createdAt: user.createdAt ?? null,
      lastSeenAt: user.lastSeenAt ?? null,
    },
  });
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : "";
  const photoURL = typeof body?.photoURL === "string" ? body.photoURL.trim() : "";
  const secretWords = typeof body?.secretWords === "string" ? body.secretWords.trim() : "";

  if (!username || !displayName) {
    return NextResponse.json(
      { success: false, message: "Username and display name are required." },
      { status: 400 }
    );
  }

  const updatedProfile = await updateUserProfile(userId, {
    username,
    displayName,
    photoURL: photoURL || null,
    secretWords,
  });

  const [leaderboardRows, checkinRecord, predictionCount] = await Promise.all([
    getLeaderboardRows(1000),
    getCheckinRecord(userId),
    getPredictionCount(userId),
  ]);

  const rank = leaderboardRows.findIndex((row) => row.id === userId) + 1;

  return NextResponse.json({
    success: true,
    profile: {
      uid: updatedProfile.uid,
      username: updatedProfile.username ?? "",
      displayName: updatedProfile.displayName ?? "",
      photoURL: updatedProfile.photoURL ?? "",
      secretWords: updatedProfile.secretWords ?? "",
      authProvider: updatedProfile.authProvider ?? "email",
      email: updatedProfile.email ?? "",
      points: updatedProfile.points ?? 0,
      rank: rank > 0 ? rank : 0,
      streak: checkinRecord?.streak ?? 0,
      predictions: predictionCount,
      joined: formatJoinedDate(updatedProfile.createdAt),
      createdAt: updatedProfile.createdAt ?? null,
      lastSeenAt: updatedProfile.lastSeenAt ?? null,
    },
  });
}
