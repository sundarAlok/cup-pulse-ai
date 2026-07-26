"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Coins,
  Flame,
  Target,
  ShieldCheck,
  Wallet,
  Crown,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

type ProfileField = "username" | "displayName" | "photoURL" | "secretWords";

type ProfileState = {
  username: string;
  displayName: string;
  email: string;
  photoURL: string;
  secretWords: string;
  points: number;
  rank: number;
  streak: number;
  predictions: number;
  correctPredictions: number;
  wrongPredictions: number;
  accuracy: string;
  bestPrediction: string;
  joined: string;
  lastCheckin: string;
  premiumActive: boolean;
  walletAddress: string;
  premiumUnlocked: string;
  rewardsClaimed: string;
  emailVerified: boolean;
};

const initialProfile: ProfileState = {
  username: "",
  displayName: "",
  email: "",
  photoURL: "",
  secretWords: "",
  points: 0,
  rank: 0,
  streak: 0,
  predictions: 0,
  correctPredictions: 0,
  wrongPredictions: 0,
  accuracy: "0%",
  bestPrediction: "—",
  joined: "Recently joined",
  lastCheckin: "Not yet",
  premiumActive: false,
  walletAddress: "Not connected",
  premiumUnlocked: "Not unlocked",
  rewardsClaimed: "0 INJ",
  emailVerified: false,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSecretWords, setShowSecretWords] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          throw new Error("Unable to load profile");
        }

        const data = await res.json();
        if (data.authenticated && data.profile) {
          setProfile((current) => ({
            ...current,
            username: data.profile.username || current.username,
            displayName: data.profile.displayName || current.displayName,
            email: data.profile.email || current.email,
            photoURL: data.profile.photoURL || current.photoURL,
            secretWords: data.profile.secretWords || current.secretWords,
            points: data.profile.points ?? current.points,
            rank: data.profile.rank ?? current.rank,
            streak: data.profile.streak ?? current.streak,
            predictions: data.profile.predictions ?? current.predictions,
            joined: data.profile.joined || current.joined,
          }));
        }
      } catch {
        setError("Unable to load your profile right now.");
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  function handleFieldChange(field: ProfileField, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: profile.username.trim(),
          displayName: profile.displayName.trim(),
          photoURL: profile.photoURL.trim(),
          secretWords: profile.secretWords.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to save profile");
      }

      if (data.profile) {
        setProfile((current) => ({
          ...current,
          username: data.profile.username || current.username,
          displayName: data.profile.displayName || current.displayName,
          email: data.profile.email || current.email,
          photoURL: data.profile.photoURL || current.photoURL,
          secretWords: data.profile.secretWords || current.secretWords,
          points: data.profile.points ?? current.points,
          rank: data.profile.rank ?? current.rank,
          streak: data.profile.streak ?? current.streak,
          predictions: data.profile.predictions ?? current.predictions,
          joined: data.profile.joined || current.joined,
        }));
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 py-28 lg:px-24">
      <div className="mx-auto max-w-7xl space-y-8">
        {error ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-white">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName || profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-black text-slate-900">
                {profile.displayName || "Your profile"}
              </h1>

              <p className="mt-1 text-slate-500">@{profile.username || "user"}</p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4 text-cyan-600" />
                  {profile.email || "No email yet"}
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4 text-cyan-600" />
                  Joined {profile.joined}
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  CupPulse Member
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Coins className="h-8 w-8 text-cyan-600" />
            <p className="mt-4 text-sm text-slate-500">Total Points</p>
            <h3 className="mt-1 text-3xl font-black text-slate-900">{profile.points}</h3>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <p className="mt-4 text-sm text-slate-500">Current Rank</p>
            <h3 className="mt-1 text-3xl font-black text-slate-900">#{profile.rank}</h3>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Flame className="h-8 w-8 text-orange-500" />
            <p className="mt-4 text-sm text-slate-500">Current Streak</p>
            <h3 className="mt-1 text-3xl font-black text-slate-900">{profile.streak}</h3>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Target className="h-8 w-8 text-violet-600" />
            <p className="mt-4 text-sm text-slate-500">Predictions Made</p>
            <h3 className="mt-1 text-3xl font-black text-slate-900">{profile.predictions}</h3>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
                  <input
                    value={profile.username}
                    onChange={(e) => handleFieldChange("username", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Display Name</span>
                  <input
                    value={profile.displayName}
                    onChange={(e) => handleFieldChange("displayName", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Photo URL</span>
                <input
                  value={profile.photoURL}
                  onChange={(e) => handleFieldChange("photoURL", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  placeholder="https://..."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Secret Words</span>
                <div className="relative">
                  <input
                    type={showSecretWords ? "text" : "password"}
                    value={profile.secretWords}
                    onChange={(e) => handleFieldChange("secretWords", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 outline-none"
                    placeholder="Enter your secret words"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretWords((current) => !current)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500"
                    aria-label={showSecretWords ? "Hide secret words" : "Show secret words"}
                  >
                    {showSecretWords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input
                  value={profile.email}
                  readOnly
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                />
              </label>
            </div>

            <div className="space-y-5">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-cyan-600">
                  <Coins className="h-5 w-5" />
                  <p className="text-sm font-medium">Total Points</p>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900">{profile.points}</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-green-600">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-sm font-medium">Account Security</p>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Email is stored in your account
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Lock className="h-4 w-4 text-slate-500" />
                    Password can be changed from account settings
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm text-slate-600">
              These fields are saved to your profile document: username, displayName, photoURL, and secretWords.
            </p>
            <button
              onClick={handleSave}
              disabled={saving || !profile.username.trim() || !profile.displayName.trim()}
              className="rounded-2xl bg-cyan-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}